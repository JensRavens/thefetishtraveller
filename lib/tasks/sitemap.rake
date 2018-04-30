namespace :sitemap do
  desc "Upload the sitemap files to S3"
  task upload_to_s3: :environment do
    s3 = Aws::S3::Resource.new

    bucket = s3.bucket(ENV["AWS_BUCKET"])

    Dir.entries(Rails.root.join("tmp", "sitemaps")).each do |file_name|
      next if [".", "..", ".DS_Store"].include? file_name
      path = "sitemaps/#{file_name}"
      file = Rails.root.join("tmp", "sitemaps", file_name)
      bucket.object(path).upload_file(file, acl: "public-read")
    end
  end
  desc "Create the sitemap, then upload it to S3 and ping the search engines"
  task create_upload_and_ping: :environment do
    Rake::Task["sitemap:create"].invoke

    Rake::Task["sitemap:upload_to_s3"].invoke

    SitemapGenerator::Sitemap.ping_search_engines("https://thefetishtraveller.com/sitemaps/sitemap.xml.gz")
  end
end
