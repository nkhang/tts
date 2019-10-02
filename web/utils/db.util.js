const mongoose = require('mongoose')
mongoose.connect('mongodb://mongo:27017/wordspeech', {
    useNewUrlParser: true
})

const Cat = mongoose.model('Cat', { name: String });

const kitty  = new Cat({name: 'team 4'})
kitty.save().then(() => console.log('meow'))
