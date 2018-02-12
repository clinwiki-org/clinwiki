export function itReturnsActionWithParams(subject, type, params) {
  expect(subject(params)).toEqual({ type, params });
}

export function itReturnsActionWithData(subject, type, data) {
  expect(subject(data)).toEqual({ type, data });
}

export function itReturnsActionWithErrors(subject, type, errors) {
  expect(subject(errors)).toEqual({ type, errors });
}

export function itReturnsAction(subject, type) {
  expect(subject()).toEqual({ type });
}
