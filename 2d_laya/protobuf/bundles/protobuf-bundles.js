var $protobuf = window.protobuf;
$protobuf.roots.default=window;
// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.template = (function() {

    /**
     * Namespace template.
     * @exports template
     * @namespace
     */
    var template = {};

    template.Login = (function() {

        /**
         * Properties of a Login.
         * @memberof template
         * @interface ILogin
         * @property {number} cmd Login cmd
         * @property {string} name Login name
         */

        /**
         * Constructs a new Login.
         * @memberof template
         * @classdesc Represents a Login.
         * @implements ILogin
         * @constructor
         * @param {template.ILogin=} [properties] Properties to set
         */
        function Login(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Login cmd.
         * @member {number} cmd
         * @memberof template.Login
         * @instance
         */
        Login.prototype.cmd = 0;

        /**
         * Login name.
         * @member {string} name
         * @memberof template.Login
         * @instance
         */
        Login.prototype.name = "";

        /**
         * Creates a new Login instance using the specified properties.
         * @function create
         * @memberof template.Login
         * @static
         * @param {template.ILogin=} [properties] Properties to set
         * @returns {template.Login} Login instance
         */
        Login.create = function create(properties) {
            return new Login(properties);
        };

        /**
         * Encodes the specified Login message. Does not implicitly {@link template.Login.verify|verify} messages.
         * @function encode
         * @memberof template.Login
         * @static
         * @param {template.ILogin} message Login message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmd);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified Login message, length delimited. Does not implicitly {@link template.Login.verify|verify} messages.
         * @function encodeDelimited
         * @memberof template.Login
         * @static
         * @param {template.ILogin} message Login message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Login message from the specified reader or buffer.
         * @function decode
         * @memberof template.Login
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {template.Login} Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.template.Login();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmd = reader.int32();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("cmd"))
                throw $util.ProtocolError("missing required 'cmd'", { instance: message });
            if (!message.hasOwnProperty("name"))
                throw $util.ProtocolError("missing required 'name'", { instance: message });
            return message;
        };

        /**
         * Decodes a Login message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof template.Login
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {template.Login} Login
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        return Login;
    })();

    template.LoginSuccess = (function() {

        /**
         * Properties of a LoginSuccess.
         * @memberof template
         * @interface ILoginSuccess
         * @property {number} cmd LoginSuccess cmd
         * @property {string} name LoginSuccess name
         */

        /**
         * Constructs a new LoginSuccess.
         * @memberof template
         * @classdesc Represents a LoginSuccess.
         * @implements ILoginSuccess
         * @constructor
         * @param {template.ILoginSuccess=} [properties] Properties to set
         */
        function LoginSuccess(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginSuccess cmd.
         * @member {number} cmd
         * @memberof template.LoginSuccess
         * @instance
         */
        LoginSuccess.prototype.cmd = 0;

        /**
         * LoginSuccess name.
         * @member {string} name
         * @memberof template.LoginSuccess
         * @instance
         */
        LoginSuccess.prototype.name = "";

        /**
         * Creates a new LoginSuccess instance using the specified properties.
         * @function create
         * @memberof template.LoginSuccess
         * @static
         * @param {template.ILoginSuccess=} [properties] Properties to set
         * @returns {template.LoginSuccess} LoginSuccess instance
         */
        LoginSuccess.create = function create(properties) {
            return new LoginSuccess(properties);
        };

        /**
         * Encodes the specified LoginSuccess message. Does not implicitly {@link template.LoginSuccess.verify|verify} messages.
         * @function encode
         * @memberof template.LoginSuccess
         * @static
         * @param {template.ILoginSuccess} message LoginSuccess message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginSuccess.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmd);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified LoginSuccess message, length delimited. Does not implicitly {@link template.LoginSuccess.verify|verify} messages.
         * @function encodeDelimited
         * @memberof template.LoginSuccess
         * @static
         * @param {template.ILoginSuccess} message LoginSuccess message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginSuccess.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginSuccess message from the specified reader or buffer.
         * @function decode
         * @memberof template.LoginSuccess
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {template.LoginSuccess} LoginSuccess
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginSuccess.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.template.LoginSuccess();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmd = reader.int32();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("cmd"))
                throw $util.ProtocolError("missing required 'cmd'", { instance: message });
            if (!message.hasOwnProperty("name"))
                throw $util.ProtocolError("missing required 'name'", { instance: message });
            return message;
        };

        /**
         * Decodes a LoginSuccess message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof template.LoginSuccess
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {template.LoginSuccess} LoginSuccess
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginSuccess.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        return LoginSuccess;
    })();

    template.Login2 = (function() {

        /**
         * Properties of a Login2.
         * @memberof template
         * @interface ILogin2
         * @property {number} cmd Login2 cmd
         * @property {string} name Login2 name
         */

        /**
         * Constructs a new Login2.
         * @memberof template
         * @classdesc Represents a Login2.
         * @implements ILogin2
         * @constructor
         * @param {template.ILogin2=} [properties] Properties to set
         */
        function Login2(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Login2 cmd.
         * @member {number} cmd
         * @memberof template.Login2
         * @instance
         */
        Login2.prototype.cmd = 0;

        /**
         * Login2 name.
         * @member {string} name
         * @memberof template.Login2
         * @instance
         */
        Login2.prototype.name = "";

        /**
         * Creates a new Login2 instance using the specified properties.
         * @function create
         * @memberof template.Login2
         * @static
         * @param {template.ILogin2=} [properties] Properties to set
         * @returns {template.Login2} Login2 instance
         */
        Login2.create = function create(properties) {
            return new Login2(properties);
        };

        /**
         * Encodes the specified Login2 message. Does not implicitly {@link template.Login2.verify|verify} messages.
         * @function encode
         * @memberof template.Login2
         * @static
         * @param {template.ILogin2} message Login2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login2.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmd);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified Login2 message, length delimited. Does not implicitly {@link template.Login2.verify|verify} messages.
         * @function encodeDelimited
         * @memberof template.Login2
         * @static
         * @param {template.ILogin2} message Login2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login2.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Login2 message from the specified reader or buffer.
         * @function decode
         * @memberof template.Login2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {template.Login2} Login2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login2.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.template.Login2();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmd = reader.int32();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("cmd"))
                throw $util.ProtocolError("missing required 'cmd'", { instance: message });
            if (!message.hasOwnProperty("name"))
                throw $util.ProtocolError("missing required 'name'", { instance: message });
            return message;
        };

        /**
         * Decodes a Login2 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof template.Login2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {template.Login2} Login2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login2.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        return Login2;
    })();

    template.LoginSuccess2 = (function() {

        /**
         * Properties of a LoginSuccess2.
         * @memberof template
         * @interface ILoginSuccess2
         * @property {number} cmd LoginSuccess2 cmd
         * @property {string} name LoginSuccess2 name
         */

        /**
         * Constructs a new LoginSuccess2.
         * @memberof template
         * @classdesc Represents a LoginSuccess2.
         * @implements ILoginSuccess2
         * @constructor
         * @param {template.ILoginSuccess2=} [properties] Properties to set
         */
        function LoginSuccess2(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginSuccess2 cmd.
         * @member {number} cmd
         * @memberof template.LoginSuccess2
         * @instance
         */
        LoginSuccess2.prototype.cmd = 0;

        /**
         * LoginSuccess2 name.
         * @member {string} name
         * @memberof template.LoginSuccess2
         * @instance
         */
        LoginSuccess2.prototype.name = "";

        /**
         * Creates a new LoginSuccess2 instance using the specified properties.
         * @function create
         * @memberof template.LoginSuccess2
         * @static
         * @param {template.ILoginSuccess2=} [properties] Properties to set
         * @returns {template.LoginSuccess2} LoginSuccess2 instance
         */
        LoginSuccess2.create = function create(properties) {
            return new LoginSuccess2(properties);
        };

        /**
         * Encodes the specified LoginSuccess2 message. Does not implicitly {@link template.LoginSuccess2.verify|verify} messages.
         * @function encode
         * @memberof template.LoginSuccess2
         * @static
         * @param {template.ILoginSuccess2} message LoginSuccess2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginSuccess2.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmd);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified LoginSuccess2 message, length delimited. Does not implicitly {@link template.LoginSuccess2.verify|verify} messages.
         * @function encodeDelimited
         * @memberof template.LoginSuccess2
         * @static
         * @param {template.ILoginSuccess2} message LoginSuccess2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginSuccess2.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginSuccess2 message from the specified reader or buffer.
         * @function decode
         * @memberof template.LoginSuccess2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {template.LoginSuccess2} LoginSuccess2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginSuccess2.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.template.LoginSuccess2();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmd = reader.int32();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("cmd"))
                throw $util.ProtocolError("missing required 'cmd'", { instance: message });
            if (!message.hasOwnProperty("name"))
                throw $util.ProtocolError("missing required 'name'", { instance: message });
            return message;
        };

        /**
         * Decodes a LoginSuccess2 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof template.LoginSuccess2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {template.LoginSuccess2} LoginSuccess2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginSuccess2.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        return LoginSuccess2;
    })();

    template.Login3 = (function() {

        /**
         * Properties of a Login3.
         * @memberof template
         * @interface ILogin3
         * @property {number} cmd Login3 cmd
         * @property {string} name Login3 name
         */

        /**
         * Constructs a new Login3.
         * @memberof template
         * @classdesc Represents a Login3.
         * @implements ILogin3
         * @constructor
         * @param {template.ILogin3=} [properties] Properties to set
         */
        function Login3(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Login3 cmd.
         * @member {number} cmd
         * @memberof template.Login3
         * @instance
         */
        Login3.prototype.cmd = 0;

        /**
         * Login3 name.
         * @member {string} name
         * @memberof template.Login3
         * @instance
         */
        Login3.prototype.name = "";

        /**
         * Creates a new Login3 instance using the specified properties.
         * @function create
         * @memberof template.Login3
         * @static
         * @param {template.ILogin3=} [properties] Properties to set
         * @returns {template.Login3} Login3 instance
         */
        Login3.create = function create(properties) {
            return new Login3(properties);
        };

        /**
         * Encodes the specified Login3 message. Does not implicitly {@link template.Login3.verify|verify} messages.
         * @function encode
         * @memberof template.Login3
         * @static
         * @param {template.ILogin3} message Login3 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login3.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmd);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified Login3 message, length delimited. Does not implicitly {@link template.Login3.verify|verify} messages.
         * @function encodeDelimited
         * @memberof template.Login3
         * @static
         * @param {template.ILogin3} message Login3 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Login3.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Login3 message from the specified reader or buffer.
         * @function decode
         * @memberof template.Login3
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {template.Login3} Login3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login3.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.template.Login3();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmd = reader.int32();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("cmd"))
                throw $util.ProtocolError("missing required 'cmd'", { instance: message });
            if (!message.hasOwnProperty("name"))
                throw $util.ProtocolError("missing required 'name'", { instance: message });
            return message;
        };

        /**
         * Decodes a Login3 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof template.Login3
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {template.Login3} Login3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Login3.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        return Login3;
    })();

    template.LoginSuccess3 = (function() {

        /**
         * Properties of a LoginSuccess3.
         * @memberof template
         * @interface ILoginSuccess3
         * @property {number} cmd LoginSuccess3 cmd
         * @property {string} name LoginSuccess3 name
         */

        /**
         * Constructs a new LoginSuccess3.
         * @memberof template
         * @classdesc Represents a LoginSuccess3.
         * @implements ILoginSuccess3
         * @constructor
         * @param {template.ILoginSuccess3=} [properties] Properties to set
         */
        function LoginSuccess3(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginSuccess3 cmd.
         * @member {number} cmd
         * @memberof template.LoginSuccess3
         * @instance
         */
        LoginSuccess3.prototype.cmd = 0;

        /**
         * LoginSuccess3 name.
         * @member {string} name
         * @memberof template.LoginSuccess3
         * @instance
         */
        LoginSuccess3.prototype.name = "";

        /**
         * Creates a new LoginSuccess3 instance using the specified properties.
         * @function create
         * @memberof template.LoginSuccess3
         * @static
         * @param {template.ILoginSuccess3=} [properties] Properties to set
         * @returns {template.LoginSuccess3} LoginSuccess3 instance
         */
        LoginSuccess3.create = function create(properties) {
            return new LoginSuccess3(properties);
        };

        /**
         * Encodes the specified LoginSuccess3 message. Does not implicitly {@link template.LoginSuccess3.verify|verify} messages.
         * @function encode
         * @memberof template.LoginSuccess3
         * @static
         * @param {template.ILoginSuccess3} message LoginSuccess3 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginSuccess3.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmd);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified LoginSuccess3 message, length delimited. Does not implicitly {@link template.LoginSuccess3.verify|verify} messages.
         * @function encodeDelimited
         * @memberof template.LoginSuccess3
         * @static
         * @param {template.ILoginSuccess3} message LoginSuccess3 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginSuccess3.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginSuccess3 message from the specified reader or buffer.
         * @function decode
         * @memberof template.LoginSuccess3
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {template.LoginSuccess3} LoginSuccess3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginSuccess3.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.template.LoginSuccess3();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmd = reader.int32();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("cmd"))
                throw $util.ProtocolError("missing required 'cmd'", { instance: message });
            if (!message.hasOwnProperty("name"))
                throw $util.ProtocolError("missing required 'name'", { instance: message });
            return message;
        };

        /**
         * Decodes a LoginSuccess3 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof template.LoginSuccess3
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {template.LoginSuccess3} LoginSuccess3
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginSuccess3.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        return LoginSuccess3;
    })();

    return template;
})();