# frozen_string_literal: true

module WebmockHelpers
  def webmock_requests
    a = []
    WebMock::RequestRegistry.instance.requested_signatures.each { |x| a << x }
    a
  end
end
