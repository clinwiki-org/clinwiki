import * as React from 'react';


export interface ListProps {
  items: string[],
  delete(item: string): void
}

export interface ListState {
  filtered: string[] 
}

class List extends React.Component<ListProps,ListState> {
  constructor(props: ListProps) {
    super(props);
    this.state={
      filtered: []
    }
    this.handleChange=this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      filtered: this.props.items
    })
  }

  componentWillReceiveProps(nextProps: ListProps) {
    this.setState({
      filtered: nextProps.items
    })
  }

  handleChange(e: any) {
    let currentList=[] as string[];
    let newList=[] as string[];
    if(e.target.value!=="")
    {
      currentList=this.props.items
      newList=currentList.filter(item => {
        const lc=item.toLowerCase();
        const filter=e.target.value.toLowerCase();
        return lc.includes(filter)
      })
    } else
    {
      newList=this.props.items
    }
    this.setState({
      filtered: newList
    })
  }

  render() {
    console.log(this.props.items)
    return (
      <div>
        
        
          {this.state.filtered.map((item: string) => (
            <button className="termstyle" key={item}>{item} &nbsp;
              <span className="delete" onClick={() => this.props.delete(item)} >x</span>
            </button>
          ))}
        
      </div>
    )
  }
}

export default List;
