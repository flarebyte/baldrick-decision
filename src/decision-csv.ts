interface DecisionRow {
  id: string;
  parent: string;
  title: string;
  description: string;
  value: string;
}

type FreeDecisionRow = Omit<DecisionRow, 'id'>;

type DecisionRowCsv = [string, string, string, string, string];

class DecisionTable {
  counter: number = 0;
  arrayTable = new Array<DecisionRow>();

  loadCsvContent(_content: string) {}
  exportAsJsonArray() {
    return this.arrayTable;
  }
  addRow(row: FreeDecisionRow) {
    const counter = this.counter++;
    const id = `${counter}`;
    const added = { id, ...row };
    this.arrayTable.push(added);
  }
  deleteRow(id: string) {
    const newArrayTable = this.arrayTable.filter((row) => row.id !== id);
    this.arrayTable = newArrayTable;
  }
  updateRow(newRow: DecisionRow) {
    for (const [idx, row] of this.arrayTable.entries()) {
      if (row.id === newRow.id) {
        this.arrayTable[idx] = newRow;
      }
    }
  }
  childrenRows(id: string) {
    return this.arrayTable.filter((row) => row.parent === id);
  }
}
