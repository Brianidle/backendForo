const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/*
[
  {
    primer comentario,
    childCommments:[
      {
        respuesta 1,
        childCommments:[
          {
            respuesta respuesta 1,
            childCommments:[]
          },
          {
            respuesta respuesta 2,
            childCommments:[]
          }
        ]
      },
      {
        respuesta 2,
        childCommments:[]
      },
      {
        respuesta 3,
        childCommments:[]
      }
    ]
  },
  {
    segundo comentario,
    childCommments:[]
  },
  {
    tercer comentario,
    childCommments:[]
  }
]

*/

module.exports = {
  post: async (parent, { idPost }, { models, idUser }) => {
    let post = await models.Post.findOne({ _id: idPost });
    let idPostAuthor = post.author;
    if (idUser) {
      if (idUser.id == idPostAuthor) {
        post.belongsToTheAuthenticatedUser = true;
      } else {
        post.belongsToTheAuthenticatedUser = false;
      }
    }

    return post;
  },
  posts: async (parent, args, { models }) => {
    return await models.Post.find();
  },
  authorPosts: async (parent, args, { models, idUser }) => {
    return await models.Post.find({ author: idUser.id });
  },
  signIn: async (parent, { username, password }, { models }) => {
    let user = await models.User.findOne({ username });

    if (user) {
      let valid = await bcrypt.compare(password, user.password);

      if (valid) {
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      } else {
        return 'UNSUCCESSFUL_SIGNIN';
      }
    } else {
      return 'UNSUCCESSFUL_SIGNIN';
    }
  },
  usernameAlreadyExists: async (parent, { username }, { models }) => {
    let user = await models.User.findOne({ username });

    if (user) {
      return true;
    } else {
      return false;
    }
  },
  comments: async (parent, { idPost }, { models }) => {
    return await models.Comment.find({ post: idPost });
  }
};

/*
INTENTO DE DEVOLVER UN ARRAY CON LOS COMENTARIOS ORDENADOS HERARQUICAMENTE
EL PROBLEMA ES QUE CUANDO LE DIGO A MONGO DB QUE ME DEVUELVA DATA usando Model.find()
este se salta a otra linea y el valor que le asigno a una variable usando la data queda en undefined

async function hierarchyComments(comments, models) {
  let commentsHierarchicallyOrdered = [];

  for (let i = 0; i < comments.length; i++) {
    let comment = comments[i];
    let childComments = [];

    childComments = await getChildComments(comment, models);
    console.log('childComments');
    console.log(childComments);
    // here you can use the result of promiseB
    if (childComments.length > 0) {
      console.log('hierarchyComments ChildComments result');
      console.log(childComments);
      commentsHierarchicallyOrdered.push({
        comment,
        childComments: hierarchyComments(childComments, models)
      });
    } else {
      return {
        comment,
        childComments: []
      };
    }
  }

  return commentsHierarchicallyOrdered;
}

async function getChildComments(comment, models) {
  let childComments = [];

  let parentChildComments = models.ParentChildComment.find({
    idParentComment: mongoose.Types.ObjectId("603c0636ca89c62718b44f88")
  });
  console.log('parentChildComments getChildComments');
  console.log(parentChildComments);
  childComments.push(parentChildComments);
  for (let i = 0; i < parentChildComments.length; i++) {
    let parentChildComment = parentChildComments[i];
    models.Comment.findOne({
      _id: parentChildComment.idChildComment
    }).then(childComment => {
      console.log('childComment getChildComments');
      console.log(childComment);
      childComments.push(childComment);
    });
  }
  console.log('childComments getChildComments');
  console.log(childComments);
  return childComments;
}


comments: (parent, { idPost }, { models }) => {
    let commentsHierarchicallyOrdered;
    models.Comment.find({
      post: idPost,
      hasParentComment: false
    })
      .sort({ _id: -1 })
      .then(function(commentsWithNoParents) {
        commentsHierarchicallyOrdered = hierarchyComments(
          commentsWithNoParents,
          models
        );
        return commentsHierarchicallyOrdered;
      });
  }
*/
