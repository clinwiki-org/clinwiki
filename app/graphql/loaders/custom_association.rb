module Loaders
  class CustomAssociation < GraphQL::Batch::Loader
    def self.validate(model, association_name)
      new(model, association_name)
      nil
    end

    def initialize(model, association_name)
      @model = model
      @association_name = association_name
      validate
    end

    def load(record)
      raise TypeError, "#{@model} loader can't load association for #{record.class}" unless record.is_a?(@model)

      return Promise.resolve(read_association(record)) if association_loaded?(record)

      super
    end

    # We want to load the associations on all records, even if they have the same id
    def cache_key(record)
      record.object_id
    end

    def perform(records)
      preload_association(records)
      records.each { |record| fulfill(record, read_association(record)) }
    end

    private

    def preload_method_name
      "preload_#{@association_name}".to_sym
    end

    def raw_association_method_name
      "#{@association_name}_raw".to_sym
    end

    def validate
      unless @model.respond_to? preload_method_name
        raise ArgumentError, "Preload method `#{preload_method_name}` is not defined on `#{@model}`"
      end

      unless @model.method_defined? raw_association_method_name
        raise ArgumentError, "Raw assosiation method `#{raw_association_method_name}` is not defined on `#{@model}` instance"
      end

      unless @model.method_defined? @association_name
        raise ArgumentError, "No association `#{@association_name}` defined on `#{@model}` instance"
      end
    end

    def preload_association(records)
      @model.send(preload_method_name, records)
    end

    def read_association(record)
      record.public_send(@association_name)
    end

    def association_loaded?(record)
      !record.public_send(raw_association_method_name).nil?
    end
  end
end
