web: puma -C config/puma.rb
worker: bundle exec sidekiq -e production -C config/sidekiq.yml
release: rake db:migrate
