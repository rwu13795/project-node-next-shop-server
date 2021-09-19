import { StockProps } from "../../../models/product/product-interfaces";
import { ColorPropsFromClient } from "..";

export default function mapStock(
  sizesArray: string[],
  colorPropsListFromClient: ColorPropsFromClient[]
): StockProps {
  let stock: StockProps = { byColor: {}, bySize: {} };
  for (let elem of colorPropsListFromClient) {
    let color = elem.colorName;
    let totalByColor = Object.values(elem.sizes).reduce((x, y) => x + y, 0);
    stock.byColor[color] = { ...elem.sizes, total: totalByColor };
    for (let size of sizesArray) {
      if (!stock.bySize[size]) {
        // NOTE have to initialize "bySize[size][color]" before we could assign a number to it
        stock.bySize[size] = { [color]: 0, total: 0 };
      }
      stock.bySize[size][color] = elem.sizes[size];
      stock.bySize[size].total = stock.bySize[size].total + elem.sizes[size];
    }
  }
  return stock;
}
