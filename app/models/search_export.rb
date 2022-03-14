class SearchExport < ApplicationRecord
  belongs_to :short_link
  belongs_to :user
  belongs_to :site_view

  def self.create_and_process!(user:, short_link:, site_view:)
    export = create!(user: user, short_link: short_link, site_view: site_view)
    CsvExportJob.perform_async("search_export_id" => export.id)
    export
  end

  def params
    JSON.parse(short_link.long).deep_symbolize_keys!
  end

  def fields
    site_view.view[:search][:fields]
  end

  def to_filename
    "clinwiki-export-#{id}-#{created_at.to_date}.csv"
  end

  def download_url
    return nil unless s3_object.exists?

    s3_object.presigned_url(:get)
  end

  def upload_to_s3(file)
    s3_object.put(body: file.read, content_type: "application/csv;charset=utf-8")
    self.s3_url = s3_object.public_url
    save
  end

  private

  def s3_object
    @s3_object ||= Aws::S3::Resource.new(region: "us-east-1").bucket("clinwiki-exports").object(to_filename)
  end
end
