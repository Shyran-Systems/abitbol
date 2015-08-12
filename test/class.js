var expect = require("expect.js");

var Class = require("../src/abitbol.js");

describe("Class", function () {

    describe("instances", function () {

        it("keeps a reference to their class", function () {
            var Cls1 = Class.$extend({
                meth1: function () {
                    $c = this.$class;
                }
            });

            var $c;
            var c1 = new Cls1();
            c1.meth1();

            expect($c).to.be(Cls1);
            expect(Cls1.$class).to.be(Cls1);
            expect(c1).to.be.an(Cls1.$class);
        });

        it("stay clean (no trash properties)", function () {
            var Cls1 = Class.$extend({

                __include__: [],
                __classvars__: {},

                meth1: function () {
                    // Here we can access to this.$super() and this.$name
                }
            });

            var c1 = new Cls1();
            c1.meth1();

            expect(Object.getOwnPropertyNames(c1)).not.to.contain("$super");
            expect(Object.getOwnPropertyNames(c1)).not.to.contain("$name");

            expect(Cls1.prototype.__include__).to.be(undefined);
            expect(Cls1.prototype.__classvars__).to.be(undefined);
            expect(c1.__include__).to.be(undefined);
            expect(c1.__classvars__).to.be(undefined);
        });

    });

    describe("inheritance", function () {

        it("allows any class to be extended", function () {
            var Cls1 = Class.$extend({
                prop1: "prop1"
            });

            var c1 = new Cls1();

            expect(c1).to.be.an(Cls1);
            expect(c1.prop1).to.equal("prop1");
        });

        it("is consistent and allows the instanceof operator to work properly", function () {
            var Cls1 = Class.$extend();
            var Cls2 = Cls1.$extend();

            var c1 = new Cls1();
            var c2 = new Cls2();

            expect(c1).to.be.an(Class);
            expect(c1).to.be.an(Cls1);
            expect(c1).not.to.be.an(Cls2);

            expect(c2).to.be.an(Class);
            expect(c2).to.be.an(Cls1);
            expect(c2).to.be.an(Cls2);
        });

        it("allows to inherit super class' properties", function () {
            var Cls1 = Class.$extend({
                prop1: "prop1"
            });

            var Cls2 = Cls1.$extend({
                prop2: "prop2"
            });

            var c2 = new Cls2();

            expect(c2.prop1).to.equal("prop1");
            expect(c2.prop2).to.equal("prop2");
        });

        it("allows super class' properties to be overridden", function () {
            var Cls1 = Class.$extend({
                prop1: "prop1"
            });

            var Cls2 = Cls1.$extend({
                prop1: "override"
            });

            var c2 = new Cls2();

            expect(c2.prop1).to.equal("override");
        });

    });

    describe("constructor", function () {

        it("is called only when the class is instantiated", function () {
            var Cls1 = Class.$extend({
                __init__: function () {
                    this.ok = true;
                }
            });

            var Cls2 = Cls1.$extend();

            var Cls3 = Cls1.$extend({
                __init__: function () {
                }
            });

            var c1 = new Cls1();
            var c2 = new Cls2();
            var c3 = new Cls3();

            expect(c1.ok).to.be.ok();
            expect(c2.ok).to.be.ok();
            expect(c3.ok).not.to.be.ok();
        });

        it("can gets argument passed to the real constructor when instantiating the class", function () {
            var Cls1 = Class.$extend({
                __init__: function (param1, param2) {
                    this.param1 = param1;
                    this.param2 = param2;
                }
            });

            var c1 = new Cls1("a", "b");

            expect(c1.param1).to.equal("a");
            expect(c1.param2).to.equal("b");
        });

    });

    describe("methods", function () {

        it("can access to a reference to their classes", function () {
            var Cls1 = Class.$extend({
                meth1: function () {
                    return this.$class;
                }
            });

            var c1 = new Cls1();

            expect(c1.meth1()).to.be(Cls1.$class);
        });

        it("can access to their own name", function () {
            var Cls1 = Class.$extend({
                meth1: function () {
                    return this.$name;
                }
            });

            var c1 = new Cls1();

            expect(c1.meth1()).to.equal("meth1");
        });

        it("can call their super method", function () {
            var Cls1 = Class.$extend({
                meth1: function (param1, param2) {
                    this.param1 = param1;
                    this.param2 = param2;
                }
            });

            var Cls2 = Cls1.$extend({
                meth1: function (param1, param2) {
                    this.$super(param2, param1);
                }
            });

            var Cls3 = Cls1.$extend({
                meth1: function () {}
            });

            var c1 = new Cls1();
            var c2 = new Cls2();
            var c3 = new Cls3();

            c1.meth1("a", "b");
            c2.meth1("a", "b");
            c3.meth1("a", "b");

            expect(c1.param1).to.equal("a");
            expect(c1.param2).to.equal("b");

            expect(c2.param1).to.equal("b");
            expect(c2.param2).to.equal("a");

            expect(c3.param1).to.be(undefined);
            expect(c3.param2).to.be(undefined);
        });

    });

    describe("mixins", function () {

        it("can include properties", function () {
            var Cls1 = Class.$extend({
                __include__: [
                    {
                        meth1: function () {},
                        attr1: "foo"
                    }
                ]
            });

            expect(Cls1.prototype.meth1).not.to.be(undefined);
            expect(Cls1.prototype.attr1).to.equal("foo");
        });

        it("included properties cannot override given properties", function () {
            var Cls1 = Class.$extend({
                __include__: [
                    {
                        attr1: "inc"
                    }
                ],

                attr1: "prop"
            });

            expect(Cls1.prototype.attr1).to.equal("prop");
        });

        it("copies only the latest included property if there is conflicts", function () {
            var Cls1 = Class.$extend({
                __include__: [
                    {
                        attr1: "inc1"
                    },
                    {
                        attr1: "inc2"
                    }
                ]
            });

            expect(Cls1.prototype.attr1).to.equal("inc2");
        });

    });

    describe("static properties", function () {

        it("can be added to the class", function () {
            var Cls1 = Class.$extend({
                __classvars__: {
                    static1: "static1"
                }
            });

            var c1 = new Cls1();

            expect(Cls1.static1).to.equal("static1");
            expect(Cls1.prototype.static1).to.be(undefined);
            expect(c1.static1).to.be(undefined);
        });

        it("can be inherited", function () {
            var Cls1 = Class.$extend({
                __classvars__: {
                    static1: "static1"
                }
            });

            var Cls2 = Cls1.$extend();

            var c2 = new Cls2();

            expect(Cls2.static1).to.equal("static1");
            expect(Cls2.prototype.static1).to.be(undefined);
            expect(c2.static1).to.be(undefined);
        });

        it("can be overridden", function () {
            var Cls1 = Class.$extend({
                __classvars__: {
                    static1: "static1"
                }
            });

            var Cls2 = Cls1.$extend({
                __classvars__: {
                    static1: "static2"
                }
            });

            var c2 = new Cls2();

            expect(Cls2.static1).to.equal("static2");
        });

    });

});
