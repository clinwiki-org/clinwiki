export function itReturnsActionWithParams(subject, type, params) {
  it(`returns action of type ${type} with params`, () => {
    expect(subject(params)).toEqual({ type, params });
  });
}

export function itReturnsActionWithData(subject, type, data) {
  it(`returns action of type ${type} with data`, () => {
    expect(subject(data)).toEqual({ type, data });
  });
}

export function itReturnsActionWithErrors(subject, type, errors) {
  it(`returns action of type ${type} with errors`, () => {
    expect(subject(errors)).toEqual({ type, errors });
  });
}

export function itReturnsAction(subject, type) {
  it(`returns action of type ${type}`, () => {
    expect(subject()).toEqual({ type });
  });
}
