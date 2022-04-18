var scene
var parent

var rotateAround = Phaser.Math.RotateAround

class MultiColliders {
    constructor(_scene, _parent) {
        scene = _scene
        parent = _parent
        this.lenght = 0
        this.colliders = []
    }

    create() {
        if(this.lenght == 0)
            return
        scene.physics.add.collider(this.colliders, this.inheritVelocity)
    }

    update() {
        parent.body.updateCenter()

        for (var i = 0; i < this.lenght; i++) {
            this.colliders[i].update()
        }
    }

    addCollider(offsetX, offsetY, radius) {
        let mainBodyColor = 0xff0000
        let secondaryBodyColor = 0xffff00
        let debugColor = secondaryBodyColor
        let isMainBody = false

        if (this.lenght == 0) {
            debugColor = mainBodyColor
            isMainBody = true
        }

        let collider = new Collider(offsetX, offsetY, radius, debugColor, isMainBody)
        collider.init()

        this.colliders.push(collider)
        this.lenght = this.colliders.length
    }

    inheritVelocity(shipComponent) {
        let v = shipComponent.body.velocity

        parent.body.velocity.copy(v)

        for(var i = 0; i < this.lenght; i++) {
            this.colliders[i].body.velocity.copy(v)
        }
    }
}

class Collider {
    constructor(offsetX, offsetY, radius, debugColor, isMainBody) {
        this.offsetX = offsetX
        this.offsetY = offsetY
        this.radius = radius
        this.debugColor = debugColor
        this.isMainBody = isMainBody
    }

    init() {
        this.c = scene.physics.add.image()
        this.c.body.setCircle(this.radius)
        this.c.setDebugBodyColor(this.debugColor)
    }

    update() {
        if(this.isMainBody) {
            this.centerBodyOnBody(this.c.body, parent.body)
        } else {
            this.centerBodyOnXY(this.c.body, parent.body.x + this.offsetX, parent.body.y + this.offsetY)
        }

        this.c.body.updateCenter()

        if(this.isMainBody == false) {
            rotateAround(this.c.body.center, parent.body.center.x, parent.body.center.y, parent.rotation)
        }

        this.centerBodyOnPoint(this.c.body, this.c.body.center)
        this.c.body.velocity.copy(parent.body.velocity)
    }

    centerBodyOnBody(a, b) {
        a.position.set(
            b.x + b.halfWidth - a.halfWidth,
            b.y + b.halfHeight - a.halfHeight
        )
    }

    centerBodyOnPoint(a, p) {
        this.centerBodyOnXY(a, p.x, p.y)
    }

    centerBodyOnXY(a, x, y) {
        a.position.set(
            x - a.halfWidth,
            y - a.halfHeight
        )
    }
}

export default MultiColliders