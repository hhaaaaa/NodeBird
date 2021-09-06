import produce, { enableES5 } from 'immer';
// enableES5를 켜줘야 produce가 ie11에서 동작 가능!
// EntryPoint(프론트 소스코드 제일 위)에 올려놓으면 되는데,
//  Next는 ReactDOM의 render 부분이 없고 알아서 처리하기 때문에
//  소스코드 제일 위에 넣기가 애매함
//  => produce를 직접 만드는 것(확장)을 권장!!

export default (...args) => {
  enableES5();
  return produce(...args);
};