import {CardComponent, ObserverComponent} from '../../../components'
import {GameModel} from '../../../models/game-model'
import Card from '../../base/card'
import {attach} from '../../base/defaults'
import {Attach} from '../../base/types'

class NetheriteArmor extends Card {
	props: Attach = {
		...attach,
		id: 'netherite_armor',
		numericId: 82,
		name: 'Netherite Armour',
		expansion: 'default',
		rarity: 'ultra_rare',
		tokens: 4,
		description:
			'When the Hermit this card is attached to takes damage, that damage is reduced by up to 40hp each turn.',
	}

	override onAttach(
		_game: GameModel,
		component: CardComponent,
		observer: ObserverComponent,
	) {
		const {player, opponentPlayer} = component

		let damageBlocked = 0

		observer.subscribe(player.hooks.onDefence, (attack) => {
			if (!attack.isTargeting(component) || attack.isType('status-effect'))
				return

			if (damageBlocked < 40) {
				const damageReduction = Math.min(
					attack.calculateDamage(),
					40 - damageBlocked,
				)
				damageBlocked += damageReduction
				attack.reduceDamage(component.entity, damageReduction)
			}
		})

		const resetCounter = () => {
			damageBlocked = 0
		}

		// Reset counter at the start of every turn
		observer.subscribe(player.hooks.onTurnStart, resetCounter)
		observer.subscribe(opponentPlayer.hooks.onTurnStart, resetCounter)
	}
}

export default NetheriteArmor
