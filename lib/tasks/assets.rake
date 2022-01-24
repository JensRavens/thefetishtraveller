# frozen_string_literal: true

namespace :assets do
  task apple_token: :environment do
    ecdsa_key = OpenSSL::PKey::EC.new IO.read ".apple-key.p8"
    headers = {
      "kid" => "WN3P9AQ2CA"
    }
    claims = {
      "iss" => "B49Y347BCU",
      "iat" => Time.now.to_i,
      "exp" => 180.days.from_now.to_i,
      "aud" => "https://appleid.apple.com",
      "sub" => "com.thefetishtraveller.web"
    }
    puts JWT.encode claims, ecdsa_key, "ES256", headers
  end

  task pull: :environment do
    config = JSON.parse(`heroku config --json`)
    region = config.fetch("AWS_REGION")
    bucket = config.fetch("AWS_BUCKET")
    key = config.fetch("AWS_ACCESS_KEY_ID")
    secret = config.fetch("AWS_SECRET_ACCESS_KEY")
    storage_folder = Rails.root.join("storage")
    download_folder = storage_folder.join("downloads")
    FileUtils.mkdir_p download_folder
    sh "AWS_DEFAULT_REGION=#{region} AWS_ACCESS_KEY_ID=#{key} AWS_SECRET_ACCESS_KEY=#{secret} aws s3 sync s3://#{bucket} #{storage_folder}/downloads"
    download_folder.each_child do |file|
      next if file.directory?

      new_path = storage_folder.join file.basename.to_s.then { |e| [e[0..1], e[2..3], e] }.join("/")
      FileUtils.mkdir_p(new_path.dirname)
      FileUtils.cp(file, new_path)
    end
    # purge variants
    ActiveStorage::VariantRecord.delete_all
    ActiveStorage::Blob.update_all(service_name: :local)
  end
end
