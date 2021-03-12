import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Link from 'next/link'
import { connect } from 'react-redux'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { ROLE } from '../src/commons'
import { watcher } from 'src/entities/Entity'
import Identity from 'src/identity/Identity'

interface IIndexProps {

}
interface IIndexState {
 
}
@watcher(Identity, ['userLogin'])
class Index extends Component<IIndexProps, IIndexState> {
  constructor (props) {
    super(props)
    this.state = {
     
    }
  }

  static async getInitialProps (ctx) {
    // console.log("Ctx",ctx.isServer)
    await ctx.store.execSagaTasks(ctx, (dispatch) => {
      // dispatch(RecipesEntity.actions.getRecipes())
    })
  }

 
  render () {
   
    return (
     <div>Hello</div>
    )
  }
}

const mapStateToProps = (state) => ({
 
})

export default connect(mapStateToProps, {
})(Index)
