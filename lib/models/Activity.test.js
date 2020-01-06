const Activity = require('./Activity');

describe('Activity Model', () => {
    it('has a required activity name', () => {
        const activity = new Activity();
        const { errors } = activity.validateSync();
        expect(errors.name.message).toEqual('Path `name` is required.');
    })
    it('has a required activity description', () => {
        const activity = new Activity();
        const { errors } = activity.validateSync();
        expect(errors.description.message).toEqual('Path `description` is required.');
    })
    it('has a required activity duration', () => {
        const activity = new Activity();
        const { errors } = activity.validateSync();
        expect(errors.duration.message).toEqual('Path `duration` is required.');
    })
})