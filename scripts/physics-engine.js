class MotorcyclePhysicsEngine {
    constructor() {
        this.world = new CANNON.World()
        this.world.gravity.set(0, -9.82, 0)
        this.world.broadphase = new CANNON.SAPBroadphase(this.world)
        this.world.solver.iterations = 20
        this.world.defaultContactMaterial = new CANNON.ContactMaterial(
            new CANNON.Material(),
            new CANNON.Material(),
            {
                friction: 0.8,
                restitution: 0.3,
                contactEquationStiffness: 1e8,
                contactEquationRelaxation: 3
            }
        )
        
        this.bodies = new Map()
        this.constraints = new Map()
        this.forces = new Map()
        this.initializePhysicsBodies()
    }

    initializePhysicsBodies() {
        const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2))
        const chassisBody = new CANNON.Body({
            mass: 180,
            material: new CANNON.Material(),
            shape: chassisShape,
            angularDamping: 0.5
        })
        
        const wheelGeometry = {
            radius: 0.3,
            height: 0.2,
            numSegments: 32
        }

        const wheelMaterial = new CANNON.Material('wheel')
        const wheelContactMaterial = new CANNON.ContactMaterial(
            wheelMaterial,
            this.world.defaultMaterial,
            {
                friction: 0.9,
                restitution: 0.01,
                contactEquationStiffness: 1e8
            }
        )
        
        this.world.addContactMaterial(wheelContactMaterial)
        this.createSuspensionSystem(chassisBody, wheelGeometry, wheelMaterial)
    }

    createSuspensionSystem(chassisBody, wheelGeometry, wheelMaterial) {
        const wheelPositions = [
            new CANNON.Vec3(-0.8, -0.5, 1.5),
            new CANNON.Vec3(0.8, -0.5, 1.5),
            new CANNON.Vec3(-0.8, -0.5, -1.5),
            new CANNON.Vec3(0.8, -0.5, -1.5)
        ]

        wheelPositions.forEach((position, index) => {
            const wheel = new CANNON.Body({
                mass: 5,
                material: wheelMaterial,
                shape: new CANNON.Cylinder(
                    wheelGeometry.radius,
                    wheelGeometry.radius,
                    wheelGeometry.height,
                    wheelGeometry.numSegments
                )
            })

            const suspensionConstraint = new CANNON.Spring(
                chassisBody,
                wheel,
                {
                    localAnchorA: position,
                    localAnchorB: new CANNON.Vec3(),
                    restLength: 0.3,
                    stiffness: 100,
                    damping: 10
                }
            )

            this.world.addConstraint(suspensionConstraint)
            this.constraints.set(`wheel_${index}`, suspensionConstraint)
            this.bodies.set(`wheel_${index}`, wheel)
        })
    }

    applyEngineForces(throttle, brake, lean) {
        const enginePower = 200 * throttle
        const brakingForce = 100 * brake
        const leanForce = 50 * lean

        this.bodies.forEach((body, key) => {
            if (key.startsWith('wheel')) {
                const isRearWheel = key.endsWith('2') || key.endsWith('3')
                if (isRearWheel) {
                    body.applyLocalForce(
                        new CANNON.Vec3(0, 0, enginePower),
                        new CANNON.Vec3(0, 0, 0)
                    )
                }
                body.applyLocalForce(
                    new CANNON.Vec3(0, 0, -brakingForce),
                    new CANNON.Vec3(0, 0, 0)
                )
            }
        })

        const chassisBody = this.bodies.get('chassis')
        chassisBody.applyLocalForce(
            new CANNON.Vec3(leanForce, 0, 0),
            new CANNON.Vec3(0, 1, 0)
        )
    }

    calculateDynamicForces() {
        const airDensity = 1.225
        const frontalArea = 1.0
        const dragCoefficient = 0.7

        this.bodies.forEach((body) => {
            const velocity = body.velocity
            const speed = velocity.length()
            const dragMagnitude = 0.5 * airDensity * Math.pow(speed, 2) * dragCoefficient * frontalArea
            const dragForce = velocity.scale(-dragMagnitude)
            body.applyForce(dragForce, body.position)
        })
    }

    update(deltaTime) {
        this.calculateDynamicForces()
        this.world.step(1/60, deltaTime, 10)
        return this.getPhysicsState()
    }

    getPhysicsState() {
        const state = {}
        this.bodies.forEach((body, key) => {
            state[key] = {
                position: body.position.toArray(),
                quaternion: body.quaternion.toArray(),
                velocity: body.velocity.toArray(),
                angularVelocity: body.angularVelocity.toArray()
            }
        })
        return state
    }
}
