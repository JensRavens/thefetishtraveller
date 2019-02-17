namespace :assets do
  task :precompile do
    sh 'yarn build'
  end

  task :clean do
  end
end
