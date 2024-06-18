import renderer from 'react-test-renderer';
import Link from '../views/Links';
import Modal from '../components/Modal'
import { create } from 'react-test-renderer'

it('changes the class when hovered', () => {
  const component = renderer.create(
    <Link page="http://www.facebook.com">Facebook</Link>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  renderer.act(() => {
    tree.props.onMouseEnter();
  });
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  renderer.act(() => {
    tree.props.onMouseLeave();
  });
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('it should work', () => {
  const component = create(<Modal />)
  const instance = component.getInstance()
  // expect(tree).toMatchSnapshot()
  console.log(instance.returnNum());
})