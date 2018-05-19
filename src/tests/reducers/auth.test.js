import authReducer from '../../reducers/auth';

test ('should set uid for login',() => {
  const uid = '123456abcdef';
  const action = {
    type: 'LOGIN',
    uid
  };
  const state = authReducer({}, action);
  expect(state).toEqual({uid});
});

test ('should clear uid for logout', () => {
  const action = {
    type: 'LOGOUT',
  };
  const state = authReducer({}, action);
  expect(state).toEqual({});
});
