const Task = require('../src/models/task')
const User = require('../src/models/user')

//finding users by their tasks
let main = async () => {
    let task = await Task.findById('abccc')
    await task.populate('owner').execPopulate() //populates the task info rather than just its id
    console.log(task.owner)
}
main()

//finding tasks by their users
let main2 = async () => {
   let user = await User.findById('sdsd')
   await user.populate('tasks').execPopulate()
   console.log(user.tasks)
}
main2()