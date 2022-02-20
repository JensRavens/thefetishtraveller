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
end
