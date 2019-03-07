class HashGenerator
  def serialize(data)
    if data.is_a?(Array)
      res = data.map { |item| serialize(item) }
      res = res.join(",")
      "[#{res}]"
    elsif data.is_a?(Hash)
      res = data.keys.sort.map { |key| "\"#{key}\":#{serialize(data[key])}" }.join(",")
      "{#{res}}"
    else
      data.to_json
    end
  end

  def hash(data)
    Digest::SHA256.base64digest(data)[0...8].tr("/+=", "_.-")
  end
end
