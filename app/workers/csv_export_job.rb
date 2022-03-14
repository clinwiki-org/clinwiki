# frozen_string_literal: true

class CsvExportJob
  include Sidekiq::Worker

  def perform(opts = {})
    raise "search_export_id is a required field!" if opts["search_export_id"].blank?

    @export = SearchExport.find(opts["search_export_id"])

    write_csv!

    # this is a little more complicated than expected,
    # because a tempfile doesn't have default content type.
    # using the s3 library, we can't upload a file and set the content type.
    tempfile.rewind
    @export.upload_to_s3(tempfile)
  end

  def tempfile
    @tempfile ||= Tempfile.new(@export.to_filename)
  end

  def write_csv!
    @csv = CSV.new(tempfile)
    @csv << @export.fields

    scroll = SearchService.new(@export.params).scroll
    while scroll.any?
      scroll.results.each do |result|
        @csv << result.slice(*@export.fields).values
      end
      scroll = scroll.scroll
    end
    scroll.clear_scroll
  end
end
