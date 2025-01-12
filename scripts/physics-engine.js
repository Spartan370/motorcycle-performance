class PhysicsEngine {
    constructor() {
        this.world = new CANNON.World()
        this.world.gravity.set(0, -9.82, 0)
        this.world.broadphase = new CANNON.NaiveBroadphase()
        this.world.solver.iterations = 10
        
        this.bodies = []
        this.constraints = []
        this.contactMaterials = new Map()
        
        this.setupPhysicsMaterials()
        this.setupCollisionEvents()
    }

    setupPhysicsMaterials() {
        this.materials = {
            tire: new CANNON.Material('tire'),
            road: new CANNON.Material('road'),
            chassis: new CANNON.Material('chassis')
        }

        const tireRoadContact = new CANNON.ContactMaterial(
            this.materials.tire,
            this.materials.road,
            {
                friction: 0.8,
                restitution: 0.3,
                contactEquationStiffness: 1e8,
                contactEquationRelaxation: 3
            }
        )

        this.world.addContactMaterial(tireRoadContact)
    }

    createMotorcyclePhysics(config) {
        const chassisShape = new CANNON.Box(
            new CANNON.Vec3(config.dimensions.width/2, 
                          config.dimensions.height/2, 
                          config.dimensions.length/2)
        )

        const chassisBody = new CANNON.Body({
            mass: config.mass,
            material: this.materials.chassis,
            shape: chassisShape,
            position: new CANNON.Vec3(0, 1, 0),
            angularDamping: 0.5
        })

        this.createWheels(chassisBody, config)
        this.createSuspension(chassisBody, config)
        
        this.motorcycle = {
            chassis: chassisBody,
            config: config
        }

        this.world.addBody(chassisBody)
        this.bodies.push(chassisBody)
    }

    createWheels(chassisBody, config) {
        const wheelShape = new CANNON.Sphere(0.3)
        const wheelMaterial = this.materials.tire

        const frontWheel = new CANNON.Body({
            mass: 20,
            material: wheelMaterial,
            shape: wheelShape,
            position: new CANNON.Vec3(0, 0.3, config.dimensions.wheelbase/2)
        })

        const rearWheel = new CANNON.Body({
            mass: 20,
            material: wheelMaterial,
            shape: wheelShape,
            position: new CANNON.Vec3(0, 0.3, -config.dimensions.wheelbase/2)
        })

        this.world.addBody(frontWheel)
        this.world.addBody(rearWheel)
        this.bodies.push(frontWheel, rearWheel)

        this.motorcycle.frontWheel = frontWheel
        this.motorcycle.rearWheel = rearWheel
    }

    createSuspension(chassisBody, config) {
        const frontSuspension = new CANNON.Spring(
            chassisBody,
            this.motorcycle.frontWheel,
            {
                localAnchorA: new CANNON.Vec3(0, 0, config.dimensions.wheelbase/2),
                localAnchorB: new CANNON.Vec3(0, 0, 0),
                restLength: config.suspension.frontTravel,
                stiffness: config.suspension.frontSpringRate,
                damping: config.suspension.frontSpringRate * 0.1
            }
        )

        const rearSuspension = new CANNON.Spring(
            chassisBody,
            this.motorcycle.rearWheel,
            {
                localAnchorA: new CANNON.Vec3(0, 0, -config.dimensions.wheelbase/2),
                localAnchorB: new CANNON.Vec3(0, 0, 0),
                restLength: config.suspension.rearTravel,
                stiffness: config.suspension.rearSpringRate,
                damping: config.suspension.rearSpringRate * 0.1
            }
        )

        this.constraints.push(frontSuspension, rearSuspension)
    }

    applyForces(controls) {
        if (!this.motorcycle) return

        const engineForce = controls.throttle * 2000
        const brakeForce = controls.brake * 1000
        const steerAngle = controls.steer * Math.PI / 4

        this.motorcycle.rearWheel.applyForce(
            new CANNON.Vec3(0, 0, engineForce),
            this.motorcycle.rearWheel.position
        )

        if (brakeForce > 0) {
            this.motorcycle.frontWheel.angularDamping = brakeForce
            this.motorcycle.rearWheel.angularDamping = brakeForce
        } else {
            this.motorcycle.frontWheel.angularDamping = 0.1
            this.motorcycle.rearWheel.angularDamping = 0.1
        }

        this.motorcycle.chassis.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            steerAngle
        )
    }

    update(deltaTime) {
        this.world.step(1/60, deltaTime, 3)
        this.constraints.forEach(constraint => constraint.applyForce())
        this.updateTelemetry()
    }

    updateTelemetry() {
        if (!this.motorcycle) return

        const velocity = this.motorcycle.chassis.velocity.length()
        const rpm = this.calculateRPM(velocity)
        const lean = this.calculateLeanAngle()

        return {
            speed: velocity * 3.6,
            rpm: rpm,
            leanAngle: lean,
            suspension: {
                frontTravel: this.constraints[0].getCurrentLength(),
                rearTravel: this.constraints[1].getCurrentLength()
            }
        }
    }

    calculateRPM(velocity) {
        const wheelCircumference = 2 * Math.PI * 0.3
        const wheelRPM = (velocity / wheelCircumference) * 60
        return wheelRPM * 5
    }

    calculateLeanAngle() {
        const rotation = this.motorcycle.chassis.quaternion
        const euler = new CANNON.Vec3()
        rotation.toEuler(euler)
        return euler.z * (180/Math.PI)
    }

    getSimulationData() {
        if (!this.motorcycle) return null

        return {
            position: this.motorcycle.chassis.position,
            rotation: this.motorcycle.chassis.quaternion,
            velocity: this.motorcycle.chassis.velocity,
            angularVelocity: this.motorcycle.chassis.angularVelocity
        }
    }
}

export default PhysicsEngine
