epxorts.UserToken = function UserToken( id, status, role, machineToken ) {
    this.id = id;
    this.status = status;
    this.role = role;
    this.machine = machineToken;
}
epxorts.UserToken.prototype = Object.create(Object.prototype, {
    ban: {
        value: function ( banType ) {
            this.machine.ban( banType );
        },
        enumerable: true
    }
});