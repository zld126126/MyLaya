//type Long = protobuf.Long;

/** Namespace template. */
declare namespace template {

    /** Properties of a Login. */
    interface ILogin {

        /** Login cmd */
        cmd: number;

        /** Login name */
        name: string;
    }

    /** Represents a Login. */
    class Login implements ILogin {

        /**
         * Constructs a new Login.
         * @param [properties] Properties to set
         */
        constructor(properties?: template.ILogin);

        /** Login cmd. */
        public cmd: number;

        /** Login name. */
        public name: string;

        /**
         * Creates a new Login instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Login instance
         */
        public static create(properties?: template.ILogin): template.Login;

        /**
         * Encodes the specified Login message. Does not implicitly {@link template.Login.verify|verify} messages.
         * @param message Login message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: template.ILogin, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified Login message, length delimited. Does not implicitly {@link template.Login.verify|verify} messages.
         * @param message Login message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: template.ILogin, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Login message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): template.Login;

        /**
         * Decodes a Login message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): template.Login;
    }

    /** Properties of a LoginSuccess. */
    interface ILoginSuccess {

        /** LoginSuccess cmd */
        cmd: number;

        /** LoginSuccess name */
        name: string;
    }

    /** Represents a LoginSuccess. */
    class LoginSuccess implements ILoginSuccess {

        /**
         * Constructs a new LoginSuccess.
         * @param [properties] Properties to set
         */
        constructor(properties?: template.ILoginSuccess);

        /** LoginSuccess cmd. */
        public cmd: number;

        /** LoginSuccess name. */
        public name: string;

        /**
         * Creates a new LoginSuccess instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginSuccess instance
         */
        public static create(properties?: template.ILoginSuccess): template.LoginSuccess;

        /**
         * Encodes the specified LoginSuccess message. Does not implicitly {@link template.LoginSuccess.verify|verify} messages.
         * @param message LoginSuccess message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: template.ILoginSuccess, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified LoginSuccess message, length delimited. Does not implicitly {@link template.LoginSuccess.verify|verify} messages.
         * @param message LoginSuccess message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: template.ILoginSuccess, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a LoginSuccess message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginSuccess
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): template.LoginSuccess;

        /**
         * Decodes a LoginSuccess message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginSuccess
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): template.LoginSuccess;
    }

    /** Properties of a Login2. */
    interface ILogin2 {

        /** Login2 cmd */
        cmd: number;

        /** Login2 name */
        name: string;
    }

    /** Represents a Login2. */
    class Login2 implements ILogin2 {

        /**
         * Constructs a new Login2.
         * @param [properties] Properties to set
         */
        constructor(properties?: template.ILogin2);

        /** Login2 cmd. */
        public cmd: number;

        /** Login2 name. */
        public name: string;

        /**
         * Creates a new Login2 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Login2 instance
         */
        public static create(properties?: template.ILogin2): template.Login2;

        /**
         * Encodes the specified Login2 message. Does not implicitly {@link template.Login2.verify|verify} messages.
         * @param message Login2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: template.ILogin2, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified Login2 message, length delimited. Does not implicitly {@link template.Login2.verify|verify} messages.
         * @param message Login2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: template.ILogin2, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Login2 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Login2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): template.Login2;

        /**
         * Decodes a Login2 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Login2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): template.Login2;
    }

    /** Properties of a LoginSuccess2. */
    interface ILoginSuccess2 {

        /** LoginSuccess2 cmd */
        cmd: number;

        /** LoginSuccess2 name */
        name: string;
    }

    /** Represents a LoginSuccess2. */
    class LoginSuccess2 implements ILoginSuccess2 {

        /**
         * Constructs a new LoginSuccess2.
         * @param [properties] Properties to set
         */
        constructor(properties?: template.ILoginSuccess2);

        /** LoginSuccess2 cmd. */
        public cmd: number;

        /** LoginSuccess2 name. */
        public name: string;

        /**
         * Creates a new LoginSuccess2 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginSuccess2 instance
         */
        public static create(properties?: template.ILoginSuccess2): template.LoginSuccess2;

        /**
         * Encodes the specified LoginSuccess2 message. Does not implicitly {@link template.LoginSuccess2.verify|verify} messages.
         * @param message LoginSuccess2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: template.ILoginSuccess2, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified LoginSuccess2 message, length delimited. Does not implicitly {@link template.LoginSuccess2.verify|verify} messages.
         * @param message LoginSuccess2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: template.ILoginSuccess2, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a LoginSuccess2 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginSuccess2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): template.LoginSuccess2;

        /**
         * Decodes a LoginSuccess2 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginSuccess2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): template.LoginSuccess2;
    }

    /** Properties of a Login3. */
    interface ILogin3 {

        /** Login3 cmd */
        cmd: number;

        /** Login3 name */
        name: string;
    }

    /** Represents a Login3. */
    class Login3 implements ILogin3 {

        /**
         * Constructs a new Login3.
         * @param [properties] Properties to set
         */
        constructor(properties?: template.ILogin3);

        /** Login3 cmd. */
        public cmd: number;

        /** Login3 name. */
        public name: string;

        /**
         * Creates a new Login3 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Login3 instance
         */
        public static create(properties?: template.ILogin3): template.Login3;

        /**
         * Encodes the specified Login3 message. Does not implicitly {@link template.Login3.verify|verify} messages.
         * @param message Login3 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: template.ILogin3, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified Login3 message, length delimited. Does not implicitly {@link template.Login3.verify|verify} messages.
         * @param message Login3 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: template.ILogin3, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a Login3 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Login3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): template.Login3;

        /**
         * Decodes a Login3 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Login3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): template.Login3;
    }

    /** Properties of a LoginSuccess3. */
    interface ILoginSuccess3 {

        /** LoginSuccess3 cmd */
        cmd: number;

        /** LoginSuccess3 name */
        name: string;
    }

    /** Represents a LoginSuccess3. */
    class LoginSuccess3 implements ILoginSuccess3 {

        /**
         * Constructs a new LoginSuccess3.
         * @param [properties] Properties to set
         */
        constructor(properties?: template.ILoginSuccess3);

        /** LoginSuccess3 cmd. */
        public cmd: number;

        /** LoginSuccess3 name. */
        public name: string;

        /**
         * Creates a new LoginSuccess3 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginSuccess3 instance
         */
        public static create(properties?: template.ILoginSuccess3): template.LoginSuccess3;

        /**
         * Encodes the specified LoginSuccess3 message. Does not implicitly {@link template.LoginSuccess3.verify|verify} messages.
         * @param message LoginSuccess3 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: template.ILoginSuccess3, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified LoginSuccess3 message, length delimited. Does not implicitly {@link template.LoginSuccess3.verify|verify} messages.
         * @param message LoginSuccess3 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: template.ILoginSuccess3, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes a LoginSuccess3 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginSuccess3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): template.LoginSuccess3;

        /**
         * Decodes a LoginSuccess3 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginSuccess3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): template.LoginSuccess3;
    }
}
