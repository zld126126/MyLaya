type Long = protobuf.Long;

/** Namespace proto. */
declare namespace proto {

    /** Properties of a Name. */
    interface IName {

        /** Name name */
        name?: (string|null);
    }

    /** Represents a Name. */
    class Name implements IName {

        /**
         * Constructs a new Name.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IName);

        /** Name name. */
        public name: string;

        /**
         * Encodes the specified Name message. Does not implicitly {@link proto.Name.verify|verify} messages.
         * @param message Name message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IName, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Name message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Name
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): proto.Name;
    }

    /** Properties of an Id. */
    interface IId {

        /** Id id */
        id?: (number|null);
    }

    /** Represents an Id. */
    class Id implements IId {

        /**
         * Constructs a new Id.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IId);

        /** Id id. */
        public id: number;

        /**
         * Encodes the specified Id message. Does not implicitly {@link proto.Id.verify|verify} messages.
         * @param message Id message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IId, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an Id message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Id
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): proto.Id;
    }

    /** Properties of a User. */
    interface IUser {

        /** User name */
        name?: (string|null);

        /** User time */
        time?: (number|Long|null);
    }

    /** Represents a User. */
    class User implements IUser {

        /**
         * Constructs a new User.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IUser);

        /** User name. */
        public name: string;

        /** User time. */
        public time: (number|Long);

        /**
         * Encodes the specified User message. Does not implicitly {@link proto.User.verify|verify} messages.
         * @param message User message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IUser, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a User message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): proto.User;
    }

    /** Properties of an Activity. */
    interface IActivity {

        /** Activity name */
        name?: (string|null);

        /** Activity tp */
        tp?: (proto.Tp|null);
    }

    /** Represents an Activity. */
    class Activity implements IActivity {

        /**
         * Constructs a new Activity.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IActivity);

        /** Activity name. */
        public name: string;

        /** Activity tp. */
        public tp: proto.Tp;

        /**
         * Encodes the specified Activity message. Does not implicitly {@link proto.Activity.verify|verify} messages.
         * @param message Activity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IActivity, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an Activity message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Activity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): proto.Activity;
    }

    /** Tp enum. */
    enum Tp {
        Tp_UnKnown = 0,
        Tp_NotStart = 1,
        Tp_Process = 2,
        Tp_End = 3
    }

    /** Represents a ServeRoute */
    class ServeRoute extends protobuf.rpc.Service {

        /**
         * Constructs a new ServeRoute service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Calls GetUser.
         * @param request Id message or plain object
         * @param callback Node-style callback called with the error, if any, and User
         */
        public getUser(request: proto.IId, callback: proto.ServeRoute.GetUserCallback): void;

        /**
         * Calls GetUser.
         * @param request Id message or plain object
         * @returns Promise
         */
        public getUser(request: proto.IId): Promise<proto.User>;

        /**
         * Calls GetActivity.
         * @param request Name message or plain object
         * @param callback Node-style callback called with the error, if any, and Activity
         */
        public getActivity(request: proto.IName, callback: proto.ServeRoute.GetActivityCallback): void;

        /**
         * Calls GetActivity.
         * @param request Name message or plain object
         * @returns Promise
         */
        public getActivity(request: proto.IName): Promise<proto.Activity>;
    }

    namespace ServeRoute {

        /**
         * Callback as used by {@link proto.ServeRoute#getUser}.
         * @param error Error, if any
         * @param [response] User
         */
        type GetUserCallback = (error: (Error|null), response?: proto.User) => void;

        /**
         * Callback as used by {@link proto.ServeRoute#getActivity}.
         * @param error Error, if any
         * @param [response] Activity
         */
        type GetActivityCallback = (error: (Error|null), response?: proto.Activity) => void;
    }
}
