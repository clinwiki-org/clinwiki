class CSVProcessorService
  include WikiHelper

  # this just mocks the "status" call in a controller
  def status(_number)
    nil
  end
end
