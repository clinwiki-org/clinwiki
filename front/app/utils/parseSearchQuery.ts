import * as lucene from "lucene"
import { SearchQueryInput } from "../types/globalTypes"

const valueOf = (entry?: string) => {
	if (entry === "<implicit>")
		return
	return entry
}

// recursively builds the query from a lucene AST
const parse = (astNode): SearchQueryInput => {
	const operator = valueOf(astNode.operator)
	const key = operator == "OR" ? "OR" : "AND"
  const left = astNode.left
  const right = astNode.right

	const children: SearchQueryInput[] = []

	// the lucene grammar has a special case for the start of queries being an operator
	if (astNode.start) {
		children.push({ key: astNode.start })
	}

	const shouldParseLeft = !!(left && (left.left || left.right))
	const shouldParseRight = !!(right && (right.left || right.right))

	const leftValue = shouldParseLeft
		? parse(left)
		: left && { key: (valueOf(left.field) ? left.field + ":" : "") + (left.term || "") }

	if (leftValue) {
		if (leftValue.key == key && leftValue.children) {
			children.push(...leftValue.children)
		} else {
			children.push(leftValue)
		}
	}

	// add unsupported operators back as children
	if (operator && !["and", "or"].includes(operator.toLowerCase())) {
		children.push({ key: operator })
	}

	const rightValue = shouldParseRight
		? parse(right)
		: right && { key: (valueOf(right.field) ? right.field + ":" : "") + (right.term || "") }

	if (rightValue) {
		if (rightValue.key == key) {
			children.push(...rightValue.children)
		} else {
			children.push(rightValue)
		}
	}

	return {
		key,
		children
	}
}

const escapeRegExp = string =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const balanceGroups = (str: string, start: string = "(", end: string = ")") => {
	// trim leading/trailing unmatched group chars
	str = str.replace(new RegExp(`^[${escapeRegExp(end)}\s]+|[${escapeRegExp(start)}\s]+$`, "g"), "")

	const emptyMatch = new RegExp(`${escapeRegExp(start)}\s*${escapeRegExp(end)}`, "g")

	// remove all empty pairs of group chars
	while (str.search(emptyMatch) > -1)
		str = str.replace(emptyMatch, "");

	// count needed group chars by number of remaining group chars of opposite type
	return (
		start.repeat((str.match(new RegExp(escapeRegExp(end), "g")) || []).length)
		+ str
		+ end.repeat((str.match(new RegExp(escapeRegExp(start), "g")) || []).length)
	)
}

const parseSearchQuery = (query: string) => {
	try {
		const tree = lucene.parse(
			balanceGroups(
				query
					.trim()
					// escape unsupported lucene query symbols
					.replace(/\+|\-|\&\&|\|\||\!|\{|\}|\[|\]|\^|\"|\~|\*|\?|\:|\\/g, "\\$&")
			)
		)

		return parse(tree)
	} catch (err) {
		// hopefully the cleaning won't allow us to get here, but users can be very creative
		console.error(err)
		return { key: "AND", children: [{ key: query }] }
	}
}

export { parseSearchQuery }

Object.assign(window, { parseSearchQuery, balanceGroups })
