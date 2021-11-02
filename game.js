class Game {
    constructor() {
        //Initialize objects
        this.engine = Matter.Engine.create();
        this.rock = Matter.Bodies.circle(200, 400, 30, {
            collisionFilter: {
                'group': 2,
                'category': 0,
                'mask': 4294967295,

            },
            restitution: 0.9999
        });
        this.boxB = Matter.Bodies.rectangle(700, 50, 100, 100);
        this.boxC = Matter.Bodies.rectangle(700, 50, 100, 100);
        this.boxD = Matter.Bodies.rectangle(700, 50, 100, 100);

        this.ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

        this.sling = Matter.Constraint.create({
            pointA: { x: 200, y: 400 },
            bodyB: this.boxA,
            length: 0,
            stiffness: 0.01,
            render: {
                type: "line"
            }
        })

        this.render = Matter.Render.create({
            element: document.body,
            engine: this.engine
        });

        this.mc = Matter.MouseConstraint.create(this.engine, {
            mouse: Matter.Mouse.create(document.body),
            collisionFilter: {
                'group': 2,
                'category': 0,
                'mask': 4294967295,
            },
            constraint: {
                stiffness: 1,
                render: {
                    visible: false
                }
            }
        });

        // sling shot launch specifications
        Matter.Events.on(this.engine, "beforeUpdate", () => {
            if (this.sling.bodyB) {
                let prevDist = Math.sqrt((this.sling.bodyB.positionPrev.x - this.sling.pointA.x) ** 2 + (this.sling.bodyB.positionPrev.y - this.sling.pointA.y) ** 2)
                let dist = Math.sqrt((this.sling.bodyB.position.x - this.sling.pointA.x) ** 2 + (this.sling.bodyB.position.y - this.sling.pointA.y) ** 2)
                if (dist < this.sling.bodyB.circleRadius && prevDist >= this.sling.bodyB.circleRadius) {
                    this.sling.bodyB.collisionFilter = {
                        'group': 0,
                        'category': 1,
                        'mask': 4294967295,
                    }
                    this.sling.bodyB = Matter.Bodies.circle(200, 400, 30, {
                        collisionFilter: {
                            'group': 2,
                            'category': 0,
                            'mask': 4294967295,
                        },

                        restitution: 0.999
                    });
                    setTimeout(() => {
                        Matter.Composite.add(this.engine.world, this.sling.bodyB)
                    }, 500);
                }
            }
        });

        // add objects and run
        Matter.Render.run(this.render)
        Matter.Composite.add(this.engine.world, [this.boxA, this.boxB, this.boxC, this.boxD, this.ground, this.sling, this.mc]);
        Matter.Runner.run(this.engine)
    }
}