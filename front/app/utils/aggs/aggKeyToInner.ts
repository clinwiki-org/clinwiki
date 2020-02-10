export default function(field, bucketKey) {
  switch (field) {
    case 'average_rating':
      return {
        0: '☆☆☆☆☆',
        1: '★☆☆☆☆',
        2: '★★☆☆☆',
        3: '★★★☆☆',
        4: '★★★★☆',
        5: '★★★★★',
      }[bucketKey];
    case 'completion_date':
    case 'start_date':
      return new Date(parseInt(bucketKey, 10)).getFullYear();
    default:
      return bucketKey;
  }
}
