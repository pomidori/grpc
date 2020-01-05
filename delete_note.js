const client = require('./client')


client.delete({ id: '1'}, (error, _) => {
    if (!error) {
      console.log('Note has been successfully deleted')
    } else {
      console.error(error)
    }
  }
)