import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import logo from './logo.svg';
import './App.css';

const MINIMUM_COSTS = [4, 5, 6, 7, 9, 11, 14, 17, 21];

function buildPlan(tier, cost) {
  // We stop at 1 instead of 0 because the math breaks down a little.
  if (tier <= 1) {
    return {"tier": 1, "cost": cost, "children": [
      {"tier": 0, "cost": 4, "children": []},
      {"tier": 0, "cost": 5, "children": []},
    ]};
  }
  return {"tier": tier, "cost": cost, "children": [
    buildPlan(tier - 1, cost - Math.ceil((tier - 1) / 2)),
    buildPlan(tier - 1, cost - Math.floor((tier - 1) / 2)),
  ]};
}

function title(tier, cost) {
  return "+" + tier + " [" + cost + "]" + (
    cost == MINIMUM_COSTS[tier] ? " ♦" : "");
}

class Chip extends Component {
  handleClick(e) {
    e.stopPropagation();
  }

  render() {
    return (
      <span>
        <input type="checkbox" onClick={this.handleClick} />
        {title(this.props.tier, this.props.cost)}
      </span>
    );
  }
}

class Plan extends Component {
  render() {
    const chip = <Chip tier={this.props.tier} cost={this.props.cost} />;
    const children = this.props.children.map((child) =>
      <Plan tier={child.tier} cost={child.cost} children={child.children} />
    );
    return (
      <Collapsible trigger={chip} transitionTime={200} lazyRender={true}
                   triggerClassName={"tier-"+this.props.tier}
                   triggerOpenedClassName={"tier-"+this.props.tier}>
        {children}
      </Collapsible>
    );
  }
}

const plan = buildPlan(8, 21);

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>NieR Fuse Tool - Plan the perfect +8 chip in NieR:Automata</h2>
          <p>Source code available at <a href="https://github.com/ogier/nier-fuse-tool">GitHub</a>.</p>
        </div>
        <Plan tier={plan.tier} cost={plan.cost} children={plan.children} />
      </div>
    );
  }
}

export default App;
