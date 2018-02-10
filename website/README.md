# AST Play UI

## Concepts

* **Play**<br>
  Play is collection of Blocks, it can be shared.
* **Block**<br>
  Block contain input and code to parse input.
  * parent      -- a Block can be children of another Block
  * input       -- input(usually source code) / Block (when parent exists)
  * code        -- parser & transform code
  * results     -- 

## Code Layout

```
src/
  c/        -- common
    ui/     -- general UI components
  p/        -- page component
  s/        -- store
  sv/       -- services (IOs)
  ui/       -- AST play ui components
```
