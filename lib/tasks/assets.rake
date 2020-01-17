# frozen_string_literal: true

namespace :assets do
  task :precompile do
    sh "yarn build"
  end

  task :clean do
  end
end
