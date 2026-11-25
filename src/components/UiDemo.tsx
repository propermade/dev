import { useState, type CSSProperties } from "react";
import {
  Banner,
  Button,
  Card,
  SegmentedControl,
  TextInput,
  Token,
} from "@propermade/core/components";

const accents = [
  { value: "#124df1", label: "Blue" },
  { value: "#0b7a4b", label: "Green" },
  { value: "#b3261e", label: "Red" },
];

/** Real @propermade/core components. The data on this page is mock data, stated plainly. */
export function LiveComponents() {
  const [view, setView] = useState("grid");
  const [name, setName] = useState("");
  return (
    <div className="demo" role="group" aria-label="Live core components">
      <div className="demo-row">
        <Button variant="primary" label="Primary" />
        <Button variant="secondary" label="Secondary" />
        <Button variant="ghost" label="Ghost" />
        <Button variant="destructive" label="Destructive" />
      </div>
      <div className="demo-row">
        <Token label="design-tokens" />
        <Token label="accessible" />
        <Token label="generated-docs" />
      </div>
      <div className="demo-row">
        <SegmentedControl.Root value={view} onChange={setView} label="View mode">
          <SegmentedControl.Item value="grid" label="Grid" />
          <SegmentedControl.Item value="list" label="List" />
          <SegmentedControl.Item value="chart" label="Chart" />
        </SegmentedControl.Root>
        <p className="demo-note">Selected: {view}</p>
      </div>
      <div className="demo-row">
        <TextInput
          label="Desk name"
          description="Mock field; nothing is sent anywhere."
          value={name}
          onChange={setName}
        />
      </div>
      <Card>
        <p className="demo-note">A core Card, rendered here with mock content.</p>
      </Card>
      <Banner status="info" title="Mock data">
        Nothing on this page comes from a live system.
      </Banner>
    </div>
  );
}

/** Drag a token and the components beside it re-theme. Values are scoped to this block, not the page. */
export function TokenEditor() {
  const [radius, setRadius] = useState(8);
  const [accent, setAccent] = useState("#124df1");
  const style = { "--radius-element": `${radius}px`, "--color-accent": accent } as CSSProperties;
  return (
    <div className="demo token-editor" style={style}>
      <div className="demo-controls">
        <label>
          <code>--radius-element</code>: {radius}px
          <input
            type="range"
            min={0}
            max={28}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </label>
        <SegmentedControl.Root value={accent} onChange={setAccent} label="--color-accent">
          {accents.map((a) => (
            <SegmentedControl.Item key={a.value} value={a.value} label={a.label} />
          ))}
        </SegmentedControl.Root>
      </div>
      <div className="demo-row">
        <Button variant="primary" label="Primary" />
        <Button variant="secondary" label="Secondary" />
        <TextInput label="Field" value="" onChange={() => {}} />
      </div>
    </div>
  );
}
