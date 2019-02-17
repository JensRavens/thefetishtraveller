namespace :assets do
  task :precompile do
    system('yarn build')
  end

  task :clean do
  end
end
