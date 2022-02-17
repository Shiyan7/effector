/* eslint-disable no-unused-vars */
import {createStore, createEvent, sample, Store, Event} from 'effector'
const typecheck = '{global}'

describe('sample(config)', () => {
  describe('sample({source, filter: store})', () => {
    it('return new event (should pass)', () => {
      const trigger = createEvent<number>()
      const allow = createStore<boolean>(false)

      const result: Event<number> = sample({
        source: trigger,
        filter: allow,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    it('support any unit (should pass)', () => {
      const trigger = createStore<number[]>([1])
      const allow = createStore<boolean>(false)

      const result: Event<number[]> = sample({
        source: trigger,
        filter: allow,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('store is not boolean (should fail)', () => {
      const trigger = createEvent<number>()
      const allow = createStore<string>('no')

      //@ts-expect-error
      sample({
        source: trigger,
        filter: allow,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        Argument of type '{ source: Event<number>; filter: Store<string>; }' is not assignable to parameter of type '{ source: Event<number>; filter: Store<string>; } & { error: \\"filter unit should has boolean type\\"; got: string; }'.
          Type '{ source: Event<number>; filter: Store<string>; }' is missing the following properties from type '{ error: \\"filter unit should has boolean type\\"; got: string; }': error, got
        "
      `)
    })
    test('result type mismatch (should fail)', () => {
      const trigger = createEvent<number>()
      const allow = createStore<string>('no')

      //@ts-expect-error
      sample({
        source: trigger,
        filter: allow,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        Argument of type '{ source: Event<number>; filter: Store<string>; }' is not assignable to parameter of type '{ source: Event<number>; filter: Store<string>; } & { error: \\"filter unit should has boolean type\\"; got: string; }'.
          Type '{ source: Event<number>; filter: Store<string>; }' is missing the following properties from type '{ error: \\"filter unit should has boolean type\\"; got: string; }': error, got
        "
      `)
    })
    describe('support target field', () => {
      it('allow to pass target field (should pass)', () => {
        const trigger: Event<number> = createEvent()
        const allow = createStore<boolean>(false)
        const target: Store<number> = createStore(0)

        sample({
          source: trigger,
          filter: allow,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          no errors
          "
        `)
      })
      test('type mismatch (should fail)', () => {
        const trigger: Event<number> = createEvent()
        const allow = createStore<boolean>(false)
        const target = createStore<string>('no')

        //@ts-expect-error
        sample({
          source: trigger,
          filter: allow,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          Argument of type '{ source: Event<number>; filter: Store<boolean>; target: Store<string>; }' is not assignable to parameter of type '{ source: Event<number>; filter: Store<boolean>; target: Store<string>; } & { error: \\"source should extend target type\\"; targets: { sourceType: number; targetType: string; }; }'.
            Type '{ source: Event<number>; filter: Store<boolean>; target: Store<string>; }' is missing the following properties from type '{ error: \\"source should extend target type\\"; targets: { sourceType: number; targetType: string; }; }': error, targets
          "
        `)
      })
    })
  })
  describe('sample({source, filter: fn})', () => {
    it('returns new event (should pass)', () => {
      const trigger = createEvent<number>()
      const result: Event<number> = sample({
        source: trigger,
        filter: n => n > 0,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('result type mismatch (should fail)', () => {
      const trigger = createEvent<number>()

      //@ts-expect-error
      const result: Event<string> = sample({
        source: trigger,
        filter: n => n > 0,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        Type 'Event<number>' is not assignable to type 'Event<string>'.
        "
      `)
    })
    describe('support target field', () => {
      it('allow to pass target field (should pass)', () => {
        const trigger = createEvent<number>()
        const target = createStore<number>(0)

        sample({
          source: trigger,
          filter: x => x > 0,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          no errors
          "
        `)
      })
      test('type mismatch (should fail)', () => {
        const trigger = createEvent<number>()
        const target = createStore<string>('no')

        //@ts-expect-error
        sample({
          source: trigger,
          filter: x => x > 0,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          Argument of type '{ source: Event<number>; filter: (x: number) => boolean; target: Store<string>; }' is not assignable to parameter of type '{ source: Event<number>; filter: (x: number) => boolean; target: Store<string>; } & { error: \\"source should extend target type\\"; targets: { sourceType: number; targetType: string; }; }'.
            Type '{ source: Event<number>; filter: (x: number) => boolean; target: Store<string>; }' is missing the following properties from type '{ error: \\"source should extend target type\\"; targets: { sourceType: number; targetType: string; }; }': error, targets
          "
        `)
      })
      describe('any to void', () => {
        test('with store (should pass)', () => {
          const filter = createStore(true)
          const source = createEvent<string>()
          const target = createEvent<void>()

          sample({
            source,
            filter,
            target,
          })
          expect(typecheck).toMatchInlineSnapshot(`
            "
            no errors
            "
          `)
        })
        test('with function (should pass)', () => {
          const source = createEvent<{pass: boolean}>()
          const target = createEvent<void>()

          sample({
            source,
            filter: ({pass}) => pass,
            target,
          })
          expect(typecheck).toMatchInlineSnapshot(`
            "
            no errors
            "
          `)
        })
      })
    })
  })
  describe('sample({source, clock, filter: fn})', () => {
    it('returns new event (should pass)', () => {
      const clock = createEvent<string>()
      const source = createEvent<number>()
      const result: Event<number> = sample({
        clock,
        source,
        filter: (src, clk) => src + clk.length > 0,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('result type mismatch (should fail)', () => {
      const clock = createEvent<string>()
      const source = createEvent<number>()

      //@ts-expect-error
      const result: Event<string> = sample({
        clock,
        source,
        filter: (src, clk) => src + clk.length > 0,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        Type 'Event<number>' is not assignable to type 'Event<string>'.
        "
      `)
    })
    describe('support target field', () => {
      it('allow to pass target field (should pass)', () => {
        const clock = createEvent<string>()
        const source = createEvent<number>()
        const target = createStore<number>(0)

        sample({
          clock,
          source,
          filter: (src, clk) => src + clk.length > 0,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          no errors
          "
        `)
      })
      test('filter + fn edge case (should pass)', () => {
        const $source = createStore({a: null as number | null, b: ''})
        const aNum = createEvent<number>()
        sample({
          source: $source,
          target: aNum,
          filter: (val): val is {a: number; b: string} =>
            typeof val.a === 'number' && val.a > 0,
          fn: val => 1,
        })
        sample({
          source: $source,
          target: aNum,
          filter: (val): val is {a: number; b: string} =>
            typeof val.a === 'number' && val.a > 0,
          fn: (val: {a: number; b: string}) => val.a + 1,
        })
        sample({
          clock: $source,
          target: aNum,
          filter: (val): val is {a: number; b: string} =>
            typeof val.a === 'number' && val.a > 0,
          fn: val => 1,
        })
        sample({
          clock: $source,
          target: aNum,
          filter: (val): val is {a: number; b: string} =>
            typeof val.a === 'number' && val.a > 0,
          fn: (val: {a: number; b: string}) => val.a + 1,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          no errors
          "
        `)
      })
      test('type mismatch (should fail)', () => {
        const clock = createEvent<string>()
        const source = createEvent<number>()
        const target = createStore<string>('no')

        //@ts-expect-error
        sample({
          clock,
          source,
          filter: (src, clk) => src + clk.length > 0,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          Argument of type '{ clock: Event<string>; source: Event<number>; filter: (src: number, clk: string) => boolean; target: Store<string>; }' is not assignable to parameter of type '{ clock: Event<string>; source: Event<number>; filter: (src: number, clk: string) => boolean; target: Store<string>; } & { error: \\"source should extend target type\\"; targets: { ...; }; }'.
            Type '{ clock: Event<string>; source: Event<number>; filter: (src: number, clk: string) => boolean; target: Store<string>; }' is missing the following properties from type '{ error: \\"source should extend target type\\"; targets: { sourceType: number; targetType: string; }; }': error, targets
          "
        `)
      })
      describe('any to void', () => {
        test('with store (should pass)', () => {
          const clock = createEvent<string>()
          const filter = createStore(true)
          const source = createEvent<string>()
          const target = createEvent<void>()

          sample({
            clock,
            source,
            filter,
            target,
          })
          expect(typecheck).toMatchInlineSnapshot(`
            "
            no errors
            "
          `)
        })
        test('with function (should pass)', () => {
          const clock = createEvent<string>()
          const source = createEvent<{pass: boolean}>()
          const target = createEvent<void>()

          sample({
            clock,
            source,
            filter: ({pass}, clk) => pass && clk.length > 0,
            target,
          })
          expect(typecheck).toMatchInlineSnapshot(`
            "
            no errors
            "
          `)
        })
      })
    })
  })
  describe('sample({source, filter: Boolean})', () => {
    it('returns new event (should pass)', () => {
      type User = {name: string}
      const trigger = createEvent<User | null>()
      const result: Event<User> = sample({
        source: trigger,
        filter: Boolean,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('result type mismatch (should fail)', () => {
      type User = {name: string}
      const trigger = createEvent<User>()

      //@ts-expect-error
      const result: Event<string> = sample({
        source: trigger,
        filter: Boolean,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        Type 'Event<User>' is not assignable to type 'Event<string>'.
          Types of property 'watch' are incompatible.
            Type '(watcher: (payload: User) => any) => Subscription' is not assignable to type '(watcher: (payload: string) => any) => Subscription'.
              Types of parameters 'watcher' and 'watcher' are incompatible.
                Types of parameters 'payload' and 'payload' are incompatible.
                  Type 'User' is not assignable to type 'string'.
        "
      `)
    })
    it('filters falsy values (should pass)', () => {
      type User = {name: string}
      type FalsyValues = null | undefined | false | 0 | 0n | ''
      const trigger = createEvent<User | FalsyValues>()
      const result: Event<User> = sample({
        source: trigger,
        filter: Boolean,
      })
      const resultFn: Event<User> = sample({
        source: trigger,
        filter: Boolean,
        fn: (arg: User) => arg,
      })
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    describe('support target field', () => {
      it('allow to pass target field (should pass)', () => {
        type User = {name: string}
        const trigger = createEvent<User | null>()
        const target = createStore<User>({name: 'alice'})

        sample({
          source: trigger,
          filter: Boolean,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          no errors
          "
        `)
      })
      test('type mismatch (should fail)', () => {
        type User = {name: string}
        const trigger = createEvent<User>()
        const target = createStore<string>('no')

        //@ts-expect-error
        sample({
          source: trigger,
          filter: Boolean,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          Argument of type '{ source: Event<User>; filter: BooleanConstructor; target: Store<string>; }' is not assignable to parameter of type '{ source: Event<User>; filter: BooleanConstructor; target: Store<string>; } & { error: \\"source should extend target type\\"; targets: { sourceType: User; targetType: string; }; }'.
            Type '{ source: Event<User>; filter: BooleanConstructor; target: Store<string>; }' is missing the following properties from type '{ error: \\"source should extend target type\\"; targets: { sourceType: User; targetType: string; }; }': error, targets
          "
        `)
      })
      test('any to void (should pass)', () => {
        const source = createEvent<{pass: boolean}>()
        const target = createEvent<void>()

        sample({
          source,
          filter: Boolean,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          no errors
          "
        `)
      })
    })
  })
  describe('sample({clock, filter: Boolean})', () => {
    it('returns new event (should pass)', () => {
      type User = {name: string}
      const trigger = createEvent<User | null>()
      const result: Event<User> = sample({
        clock: trigger,
        filter: Boolean,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('result type mismatch (should fail)', () => {
      type User = {name: string}
      const trigger = createEvent<User>()

      //@ts-expect-error
      const result: Event<string> = sample({
        clock: trigger,
        filter: Boolean,
      })

      expect(typecheck).toMatchInlineSnapshot(`
        "
        Type 'Event<User>' is not assignable to type 'Event<string>'.
          Types of property 'watch' are incompatible.
            Type '(watcher: (payload: User) => any) => Subscription' is not assignable to type '(watcher: (payload: string) => any) => Subscription'.
              Types of parameters 'watcher' and 'watcher' are incompatible.
                Types of parameters 'payload' and 'payload' are incompatible.
                  Type 'User' is not assignable to type 'string'.
        "
      `)
    })
    describe('support target field', () => {
      it('allow to pass target field (should pass)', () => {
        type User = {name: string}
        const trigger = createEvent<User | null>()
        const target = createStore<User>({name: 'alice'})

        sample({
          clock: trigger,
          filter: Boolean,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          no errors
          "
        `)
      })
      test('type mismatch (should fail)', () => {
        type User = {name: string}
        const trigger = createEvent<User>()
        const target = createStore<string>('no')

        //@ts-expect-error
        sample({
          clock: trigger,
          filter: Boolean,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          Argument of type '{ clock: Event<User>; filter: BooleanConstructor; target: Store<string>; }' is not assignable to parameter of type '{ clock: Event<User>; filter: BooleanConstructor; target: Store<string>; } & { error: \\"clock should extend target type\\"; targets: { clockType: User; targetType: string; }; }'.
            Type '{ clock: Event<User>; filter: BooleanConstructor; target: Store<string>; }' is missing the following properties from type '{ error: \\"clock should extend target type\\"; targets: { clockType: User; targetType: string; }; }': error, targets
          "
        `)
      })
      test('any to void (should pass)', () => {
        const clock = createEvent<{pass: boolean}>()
        const target = createEvent<void>()

        sample({
          clock,
          filter: Boolean,
          target,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          no errors
          "
        `)
      })
    })
  })
})

describe('filter return validation', () => {
  const anyt = createEvent<any>()
  describe('wrong return', () => {
    test('sample({source, filter}) (should fail)', () => {
      //@ts-expect-error
      sample({source: anyt, filter: () => 0})
      expect(typecheck).toMatchInlineSnapshot(`
        "
        Argument of type '[{ source: Event<any>; filter: () => number; }]' is not assignable to parameter of type '[config: { source: Event<any>; clock?: undefined; filter: (src: any) => src is any; greedy?: boolean | undefined; name?: string | undefined; } & { source: Event<any>; filter: () => number; }] | [config: ...]'.
          Type '[{ source: Event<any>; filter: () => number; }]' is not assignable to type '[config: { source: Event<any>; clock?: undefined; filter: (src: any) => boolean; greedy?: boolean | undefined; name?: string | undefined; } & { source: Event<any>; filter: () => number; }]'.
            Type '{ source: Event<any>; filter: () => number; }' is not assignable to type '{ source: Event<any>; clock?: undefined; filter: (src: any) => boolean; greedy?: boolean | undefined; name?: string | undefined; } & { source: Event<any>; filter: () => number; }'.
              Type '{ source: Event<any>; filter: () => number; }' is not assignable to type '{ source: Event<any>; clock?: undefined; filter: (src: any) => boolean; greedy?: boolean | undefined; name?: string | undefined; }'.
                The types returned by 'filter(...)' are incompatible between these types.
                  Type 'number' is not assignable to type 'boolean'.
        "
      `)
    })
    test('sample({clock, filter}) (should fail)', () => {
      //@ts-expect-error
      sample({clock: anyt, filter: () => 0})
      expect(typecheck).toMatchInlineSnapshot(`
        "
        Argument of type '[{ clock: Event<any>; filter: () => number; }]' is not assignable to parameter of type '[config: { clock: Event<any>; source?: undefined; filter: (clk: any) => clk is any; greedy?: boolean | undefined; name?: string | undefined; } & { clock: Event<any>; filter: () => number; }] | [config: ...]'.
          Type '[{ clock: Event<any>; filter: () => number; }]' is not assignable to type '[config: { clock: Event<any>; source?: undefined; filter: (clk: any) => boolean; greedy?: boolean | undefined; name?: string | undefined; } & { clock: Event<any>; filter: () => number; }]'.
            Type '{ clock: Event<any>; filter: () => number; }' is not assignable to type '{ clock: Event<any>; source?: undefined; filter: (clk: any) => boolean; greedy?: boolean | undefined; name?: string | undefined; } & { clock: Event<any>; filter: () => number; }'.
              Type '{ clock: Event<any>; filter: () => number; }' is not assignable to type '{ clock: Event<any>; source?: undefined; filter: (clk: any) => boolean; greedy?: boolean | undefined; name?: string | undefined; }'.
                The types returned by 'filter(...)' are incompatible between these types.
                  Type 'number' is not assignable to type 'boolean'.
        "
      `)
    })
    test('sample({source, clock, filter}) (should fail)', () => {
      //@ts-expect-error
      sample({source: anyt, clock: anyt, filter: () => 0})
      expect(typecheck).toMatchInlineSnapshot(`
        "
        Argument of type '[{ source: Event<any>; clock: Event<any>; filter: () => number; }]' is not assignable to parameter of type '[config: { clock: Event<any>; source: Event<any>; filter: (src: any, clk: any) => src is any; greedy?: boolean | undefined; name?: string | undefined; } & { source: Event<any>; clock: Event<...>; filter: () => number; }] | [config: ...]'.
          Type '[{ source: Event<any>; clock: Event<any>; filter: () => number; }]' is not assignable to type '[config: { clock: Event<any>; source: Event<any>; filter: (src: any, clk: any) => boolean; greedy?: boolean | undefined; name?: string | undefined; } & { source: Event<any>; clock: Event<...>; filter: () => number; }]'.
            Type '{ source: Event<any>; clock: Event<any>; filter: () => number; }' is not assignable to type '{ clock: Event<any>; source: Event<any>; filter: (src: any, clk: any) => boolean; greedy?: boolean | undefined; name?: string | undefined; } & { source: Event<any>; clock: Event<...>; filter: () => number; }'.
              Type '{ source: Event<any>; clock: Event<any>; filter: () => number; }' is not assignable to type '{ clock: Event<any>; source: Event<any>; filter: (src: any, clk: any) => boolean; greedy?: boolean | undefined; name?: string | undefined; }'.
                The types returned by 'filter(...)' are incompatible between these types.
                  Type 'number' is not assignable to type 'boolean'.
        "
      `)
    })
  })
  describe('boolean return', () => {
    test('sample({source, filter}) (should pass)', () => {
      sample({source: anyt, filter: () => true as boolean})
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('sample({clock, filter}) (should pass)', () => {
      sample({clock: anyt, filter: () => true as boolean})
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('sample({source, clock, filter}) (should pass)', () => {
      sample({source: anyt, clock: anyt, filter: () => true as boolean})
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
  })
  describe('boolean subtype return', () => {
    test('sample({source, filter}) (should pass)', () => {
      sample({source: anyt, filter: () => true as true})
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('sample({clock, filter}) (should pass)', () => {
      sample({clock: anyt, filter: () => true as true})
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('sample({source, clock, filter}) (should pass)', () => {
      sample({source: anyt, clock: anyt, filter: () => true as true})
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
  })
})

describe('any support in arguments inference', () => {
  function assertNonNever<T>(val: T): [T] extends [never] ? 'never' : 'ok' {
    return val as any
  }
  const anyt = createEvent<any>()
  test('sample({source, filter}) (should pass)', () => {
    sample({
      source: anyt,
      filter(src) {
        const x: 'ok' = assertNonNever(src)
        return false
      },
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('sample({clock, filter}) (should pass)', () => {
    sample({
      clock: anyt,
      filter(clk) {
        const x: 'ok' = assertNonNever(clk)
        return false
      },
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('sample({clock: [clock], filter}) (should pass)', () => {
    sample({
      clock: [anyt],
      filter(clk) {
        const x: 'ok' = assertNonNever(clk)
        return false
      },
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('sample({source, clock, filter}) (should pass)', () => {
    sample({
      source: anyt,
      clock: anyt,
      filter(src, clk) {
        const x1: 'ok' = assertNonNever(src)
        const x2: 'ok' = assertNonNever(clk)
        return false
      },
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('sample({source, clock: [clock], filter}) (should pass)', () => {
    sample({
      source: anyt,
      clock: [anyt],
      filter(src, clk) {
        const x1: 'ok' = assertNonNever(src)
        const x2: 'ok' = assertNonNever(clk)
        return false
      },
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})

test('sample return type supports union types (should pass)', () => {
  const trigger = createEvent<{a: 1} | {a: 2}>()
  const allow = createStore<boolean>(false)

  const result: Event<{a: 1} | {a: 2}> = sample({
    source: trigger,
    filter: allow,
  })

  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('incorrect filter (should fail)', () => {
  const trigger = createEvent()
  const target = createEvent()
  function factory() {
    //@ts-expect-error
    sample({
      source: trigger,
      filter: null,
      target,
    })
  }
  expect(typecheck).toMatchInlineSnapshot(`
    "
    Argument of type '[{ source: Event<void>; filter: null; target: Event<void>; }]' is not assignable to parameter of type '[config: never] | [config: never]'.
      Type '[{ source: Event<void>; filter: null; target: Event<void>; }]' is not assignable to type '[config: never]'.
        Type '{ source: Event<void>; filter: null; target: Event<void>; }' is not assignable to type 'never'.
          The intersection '{ source: Event<void>; clock?: undefined; filter: (src: void) => boolean; target: Event<void>; greedy?: boolean | undefined; } & { source: Event<void>; filter: null; target: Event<...>; }' was reduced to 'never' because property 'filter' has conflicting types in some constituents.
    "
  `)
})
