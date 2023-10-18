#1
db.books.insertMany([
    {
        title: "title1",
        description: "desc1",
        authors: "author1"
    },
    {
        title: "title2",
        description: "desc2",
        authors: "author2"
    }
])

#2
db.books.find({title: "title1"})

#3
db.books.updateOne({_id: ObjectId("someId")}, {
    $set: {
        description: "newDesc",
        authors: "newAuthor"
    }
})