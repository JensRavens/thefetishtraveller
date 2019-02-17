namespace :assets do
  task :precompile do
    system('yarn build')
  end
end
