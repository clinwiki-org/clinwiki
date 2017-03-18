# save AACT database settings in global var
DB_AACT = YAML::load(ERB.new(File.read(Rails.root.join("config","aact_database.yml"))).result)[Rails.env]

