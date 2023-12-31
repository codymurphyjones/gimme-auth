import { useReducer } from "react";
import { StateSlice, Validation, Validator } from "./validation";
import { ConvertDefaultStateToValidationStructure, makeReducer } from "./state";
import type {
  InferValidatorType,
  ValidationData,
  ValidationSource,
  ValidationUpdate,
} from "./validation/types";
import React from "react";

export function onChange(update: (val: string) => void) {
  return (event: React.ChangeEvent<HTMLInputElement>) =>
    update(event.currentTarget.value);
}

export function onBlur(update: (val: string) => void) {
  return (event: React.ChangeEvent<HTMLInputElement>) =>
    update(event.currentTarget.value);
}

type ValidationOutput<T, K extends keyof ValidationSource<T>> = {
  onChange: ReturnType<typeof onChange>;
  onBlur: ReturnType<typeof onBlur>;
  value: ValidationSource<T>[K] extends Validator<infer U> ? U : never;
  name: K;
  style?: React.CSSProperties;
  ref?: React.RefObject<HTMLInputElement>;
};

function checkStrictValidation(val: unknown) {
  if (typeof val === "string") {
    return val.length === 0;
  } else if (typeof val === "number") {
    return val === 0;
  } else if (Array.isArray(val)) {
    return val.length === 0;
  }
  return false;
}

type ValidationActions<T> = {
  watch: <K extends keyof ValidationSource<T>>(
    key: K
  ) => InferValidatorType<ValidationSource<T>[K]>;
  update: <K extends keyof ValidationSource<T>>(
    key: K,
    val: InferValidatorType<ValidationSource<T>[K]>
  ) => void;
  focus: <K extends keyof ValidationSource<T>>(key: K) => void;
};

type ValidationHook<T> = {
  sync: <K extends keyof ValidationSource<T>>(
    key: K,
    base?: React.CSSProperties,
    invalid?: React.CSSProperties
  ) => ValidationOutput<T, K>;
  isValid: <K extends keyof ValidationSource<T>>(
    key: K,
    strict?: boolean
  ) => boolean;
  actions: ValidationActions<T>;
};

function compile<State extends { [key: string]: unknown }>(
  slice: StateSlice<State>
): ValidationSource<State> {
  const compiledState: ValidationSource<State> = {} as ValidationSource<State>;

  for (const key in slice.state) {
    if (Object.prototype.hasOwnProperty.call(slice.state, key)) {
      const keyTyped = key as keyof State;
      if (slice.validation[keyTyped]) {
        compiledState[keyTyped] = slice.validation[keyTyped] as Validator<
          State[keyof State]
        >;
      } else {
        compiledState[keyTyped] = new Validator(
          slice.state[keyTyped]
        ) as Validator<State[keyof State]>;
      }
    }
  }

  return compiledState;
}

export type StateType<T> = T extends { [key: string]: unknown } ? T : never;
export type StateSliceType<T> = T extends StateSlice<infer S>
  ? StateSlice<StateType<S>>
  : never;
export type ValidationSourceType<T> = T extends ValidationSource<infer S>
  ? ValidationSource<StateType<S>>
  : never;
export type InputState<T> = StateSliceType<T> | ValidationSourceType<T>;

function isStateSlice<T extends { [key: string]: unknown }>(
  obj: unknown
): obj is StateSlice<T> {
  return typeof obj === "object" && obj !== null && "state" in obj;
}

function isValidationSource<T>(obj: any): obj is ValidationSource<T> {
  return !isStateSlice(obj);
}

export function useValidation<K extends { [key: string]: unknown }, T>(
  defaultFormState: StateSlice<K>
): ValidationHook<K>;
export function useValidation<K, T>(
  defaultFormState: ValidationSourceType<T>
): ValidationHook<T>;
export function useValidation<K extends { [key: string]: unknown }, T>(
  defaultFormState: StateSlice<K> | ValidationSourceType<T>
): ValidationHook<K> | ValidationHook<T> {
  const objTypeRes = isStateSlice(defaultFormState);
  const compiled = compile(defaultFormState);
  return useValidationHook(
    objTypeRes ? compiled : (defaultFormState as ValidationSource<K>)
  );
}

export function useValidationHook<T>(
  defaultFormState: ValidationSource<T>
): ValidationHook<T> {
  const validationStructure =
    ConvertDefaultStateToValidationStructure(defaultFormState);
  const keysSynced: (keyof ValidationSource<T>)[] = [];

  const [state, dispatch] = useReducer(
    makeReducer(validationStructure),
    validationStructure[0]
  ) as [ValidationData<T>, React.Dispatch<Partial<ValidationUpdate<T>>>];

  //const refCollection = React.useRef(new Map()).current;

  const refCollection = new Map<
    keyof ValidationSource<T>,
    React.RefObject<HTMLInputElement>
  >();

  function update<K extends keyof ValidationSource<T>>(
    key: K,
    val: InferValidatorType<ValidationSource<T>[K]>
  ) {
    const action: Partial<ValidationUpdate<T>> = {};
    action[key] = val as ValidationUpdate<T>[K];
    dispatch(action);
  }

  function watch<K extends keyof ValidationSource<T>>(key: K) {
    const valNode = state[key];
    const val = valNode.value;
    return val as InferValidatorType<ValidationSource<T>[K]>;
  }

  function isValid<K extends keyof ValidationSource<T>>(
    key?: K | boolean,
    strict = false
  ): boolean {
    if (typeof key === "string") {
      // Specific field validation
      if (strict) {
        return state[key].valid;
      } else {
        const isZeroLength = checkStrictValidation(state[key].value);
        return isZeroLength ? true : state[key].valid;
      }
    } else if (typeof key === "boolean") {
      // All fields validation, strictness determined by 'key'
      return Object.keys(state).every((fieldKey) =>
        isValid(fieldKey as K, key)
      );
    } else if (key === undefined) {
      // All fields validation, strict
      return Object.keys(state).every((fieldKey) =>
        isValid(fieldKey as K, strict)
      );
    } else {
      throw new Error("Invalid argument passed to isValid function");
    }
  }

  function sync<K extends keyof ValidationSource<T>>(
    key: K,
    base?: React.CSSProperties,
    invalid?: React.CSSProperties
  ): ValidationOutput<T, K> {
    if (!refCollection.has(key)) {
      refCollection.set(key, React.createRef());
    }
    keysSynced.push(key);
    const isStateValid = isValid(key);
    //const fieldData = state[key].value;
    const fieldData = state[key]
      .value as ValidationSource<T>[K] extends Validator<infer U> ? U : never;

    return {
      onChange: onChange((val) =>
        update(key, val as InferValidatorType<ValidationSource<T>[K]>)
      ),
      onBlur: onBlur((val) =>
        update(key, val as InferValidatorType<ValidationSource<T>[K]>)
      ),
      name: key,
      value: fieldData,
      ref: refCollection.get(key),
      style: isStateValid ? base : { ...base, ...invalid },
    };
  }

  function focus<K extends keyof ValidationSource<T>>(key: K): void {
    const ref = refCollection.get(key);
    if (keysSynced.includes(key) && ref?.current) {
      ref.current.focus();
    }
  }

  const actions: ValidationActions<T> = {
    watch,
    update,
    focus,
  };
  return { sync, isValid, actions };
}

export { Validation };
