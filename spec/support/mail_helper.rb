# frozen_string_literal: true

class TestMail
  attr_reader :to, :from, :subject, :body

  def initialize(mail)
    @to = mail["to"].to_s
    @from = mail["from"].to_s
    @subject = mail.subject
    @body = Nokogiri::HTML(mail.body.to_s)
  end

  def button_link
    body.css("a.button").attr("href").value.presence&.then { |url| url.split(":3000").last }
  end
end

module MailHelper
  class NoMailSentError < StandardError; end

  def last_mail
    mails.last
  end

  def last_mail!
    last_mail || raise(NoMailSentError)
  end

  def mails
    # quite often jobs are pending - execute them automatically so we have mails in our deliveries and clean up the tests
    if pending_mail_job
      jobs = enqueued_jobs.dup
      perform_enqueued_jobs
      enqueued_jobs.reject! { |e| jobs.include? e }
    end
    ActionMailer::Base.deliveries.map { |e| TestMail.new e }
  end

  def pending_mail_job
    enqueued_jobs.find { |e| e[:job] == ActionMailer::MailDeliveryJob }
  end
end

ActionMailer::Base.deliveries.clear

RSpec.configure do |config|
  config.before do
    ActionMailer::Base.deliveries.clear
  end
  config.include MailHelper, type: :model
  config.include MailHelper, type: :system
end
