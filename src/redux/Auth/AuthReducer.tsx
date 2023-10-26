import {
  SIGN_IN,
  NO_USER,
  SIGN_OUT,
  SIGN_UP,
  SET_USER,
  SET_LOADING,
} from "./AuthActions";

const AuthReducer = (
  state = {
    loading: true,
    user: null,
  },
  action: any
) => {
  switch (action.type) {
    case NO_USER: {
      return {
        ...state,
        user: null,
        loading: false,
      };
    }
    case SIGN_IN: {
      return {
        ...state,
        user: action.payload,
      };
    }
    case SIGN_OUT: {
      return {
        ...state,
        user: null,
      };
    }
    case SIGN_UP: {
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    }
    case SET_USER: {
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    }

    case SET_LOADING: {
      return {
        ...state,
        loading: action.payload,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
