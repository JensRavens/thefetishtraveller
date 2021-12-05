web: bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq -e production
release: DB_POOL=2 bundle exec rake db:migrate
