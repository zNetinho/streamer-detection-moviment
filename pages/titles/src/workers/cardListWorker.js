onmessage = ({ data }) => {

  let counter = 0;

  console.log('activating blocking operations...', data.maxItens)
  console.log()

  for(;counter < data.maxItens; counter++) console.log('.')


  postMessage({
    response: 'ok', data: counter
  })
}