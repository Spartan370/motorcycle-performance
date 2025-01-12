class PhysicsEngine {
    constructor() {
        this.world = new CANNON.World()
        this.bodies = []
        this.constraints = []
        
        this.initialize()
    }

    initialize() {
        this.world.gravity.set(0, -9.82, 0)
        this.world.broadphase = new CANNON.NaiveBroadphase()
        this.world.solver.iterations = 10
        
        this.setupCollisionMaterials()
        this.setupContactMaterials()
    }

    setupCollisionMaterials() {
        this.materials = {
            tire: new CANNON.Material('tire'),
            ground: new CANNON.Material('ground'),
            chassis: new CANNON.Material('chassis')
        }
    }

    setupContactMaterials() {
        const tireFriction = new CANNON.ContactMaterial(
            this.materials.tire,
            this.materials.ground,
            {
                friction: 0.9,
                restitution: 0.3,
                contactEquationStiffness: 1000
            }
        )
        
        this.world.addContactMaterial(tireFriction)
    }

    createMotorcyclePhysics(modelData) {
        const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2))
        const chassisBody = new CANNON.Body({
            mass: 180,
            material: this.materials.chassis,
            shape: chassisShape
        })
        
        this.setupWheels(chassisBody)
        this.setupSuspension(chassisBody)
        
        this.bodies.push(chassisBody)
        this.world.addBody(chassisBody)
        
        return chassisBody
    }

    setupWheels(chassisBody) {
        const wheelShape = new CANNON.Sphere(0.3)
        const wheelMaterial = this.materials.tire
        
        const frontWheel = new CANNON.Body({
            mass: 10,
            material: wheelMaterial,
            shape: wheelShape
        })
        
        const rearWheel = new CANNON.Body({
            mass: 10,
            material: wheelMaterial,
            shape: wheelShape
        })
        
        this.bodies.push(frontWheel, rearWheel)
        this.world.addBody(frontWheel)
        this.world.addBody(rearWheel)
    }

    setupSuspension(chassisBody) {
        const frontSuspension = new CANNON.Spring(chassisBody, this.bodies[1], {
            restLength: 0.3,
            stiffness: 30,
            damping: 4,
            localAnchorA: new CANNON.Vec3(0, -0.5, 1),
            localAnchorB: new CANNON.Vec3(0, 0, 0)
        })
        
        const rearSuspension = new CANNON.Spring(chassisBody, this.bodies[2], {
            restLength: 0.3,
            stiffness: 30,
            damping: 4,
            localAnchorA: new CANNON.Vec3(0, -0.5, -1),
            localAnchorB: new CANNON.Vec3(0, 0, 0)
        })
        
        this.constraints.push(frontSuspension, rearSuspension)
    }

    applyForces(body, forces) {
        body.applyLocalForce(
            new CANNON.Vec3(forces.x, forces.y, forces.z),
            new CANNON.Vec3(0, 0, 0)
        )
    }

    update(deltaTime) {
        this.world.step(1/60, deltaTime, 3)
        this.updateConstraints()
    }

    updateConstraints() {
        this.constraints.forEach(constraint => {
            if (constraint instanceof CANNON.Spring) {
                constraint.applyForce()
            }
        })
    }

    getBodyPosition(body) {
        return {
            x: body.position.x,
            y: body.position.y,
            z: body.position.z
        }
    }

    getBodyRotation(body) {
        return {
            x: body.quaternion.x,
            y: body.quaternion.y,
            z: body.quaternion.z,
            w: body.quaternion.w
        }
    }
}

export default PhysicsEngine
