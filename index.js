const uuidv1 = require('uuid/v1')
const grpc = require('grpc')
const PROTO_PATH = './notes.proto'
const notesProto = grpc.load(PROTO_PATH)

const notes = [
  { id: '1', title: 'Note 1', content: 'Content 1' },
  { id: '2', title: 'Note 2', content: 'Content 2' },
  { id: '3', title: 'Note 3', content: 'Content 3' }
]

const server = new grpc.Server()

/* Add the NoteService object defined in the notes.proto file
as a first argument. The second argument accepts an object that
will assign the list key with the value of function handler that 
will be invoked when the client calls the List method.

list:
  (_, callback)
    1st arg: the call request from the Client
    2nd arg: the callback function we will invoke to return the response
  callback(null, notes)
    1st arg: return error object, but this time just return null
    2nd arg: call the callback function to pass notes
*/
server.addService(notesProto.NoteService.service, {
  list: (_, callback) => {
    callback(null, notes)
  },
  insert: (call, callback) => {
    let note = call.request
    note.id = uuidv1()
    notes.push(note)
    callback(null, note)
  },
  delete: (call, callback) => {
    let existingNoteIndex = notes.findIndex(
      (n) => n.id == call.request.id
    )
    if (existingNoteIndex != -1) {
      notes.splice(existingNoteIndex, 1)
      callback(null, {})
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found"
      })
    }
  }
})


server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
console.log('GRPC server running at: http://127.0.0.1:50051')
server.start()