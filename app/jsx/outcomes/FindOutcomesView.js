/*
 * Copyright (C) 2021 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {View} from '@instructure/ui-view'
import {Flex} from '@instructure/ui-flex'
import {Text} from '@instructure/ui-text'
import {Heading} from '@instructure/ui-heading'
import {Button} from '@instructure/ui-buttons'
import I18n from 'i18n!OutcomeManagement'
import FindOutcomeItem from './FindOutcomeItem'
import OutcomeSearchBar from './Management/OutcomeSearchBar'
import {addZeroWidthSpace} from '../shared/helpers/addZeroWidthSpace'

// Mocked data to display list of outcomes
// Remove after integration with GraphQL data
import {findOutcomeGroupMockData} from './__tests__/mocks'

const FindOutcomesView = ({
  collection,
  searchString,
  onChangeHandler,
  onClearHandler,
  onAddAllHandler
}) => {
  const {name: groupTitle, outcomesCount} = collection
  const enabled = !!outcomesCount && outcomesCount > 0

  // The code section below works with mocked data only
  // Modify as needed to integrate with GraphQL data
  const [selectedOutcomes, setSelectedOutcomes] = useState({})
  const onSelectOutcomesHandler = id =>
    setSelectedOutcomes(prevState => {
      const updatedState = {...prevState}
      prevState[id] ? delete updatedState[id] : (updatedState[id] = true)
      return updatedState
    })
  const {children} = findOutcomeGroupMockData
  const outcomeList = children?.map(({id, title, description}) => (
    <FindOutcomeItem
      key={id}
      id={id}
      title={title}
      description={description}
      isChecked={!!selectedOutcomes[id]}
      onCheckboxHandler={onSelectOutcomesHandler}
    />
  ))

  return (
    <View
      as="div"
      height="100%"
      minWidth="300px"
      padding="0 x-large 0 medium"
      data-testid="find-outcome-container"
    >
      <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
        <View as="div" padding="0 0 x-small" borderWidth="0 0 small">
          <View as="div" padding="small 0 0">
            <Heading level="h2" as="h3">
              <div style={{overflowWrap: 'break-word'}}>
                {groupTitle ? addZeroWidthSpace(groupTitle) : I18n.t('Outcome Group')}
              </div>
            </Heading>
          </View>
          <View as="div" padding="large 0 medium">
            <OutcomeSearchBar
              enabled={enabled}
              placeholder={
                groupTitle
                  ? I18n.t('Search within %{groupTitle}', {groupTitle})
                  : I18n.t('Search within outcome group')
              }
              searchString={searchString}
              onChangeHandler={onChangeHandler}
              onClearHandler={onClearHandler}
            />
          </View>
          <View as="div" position="relative" padding="0 0 small">
            <Flex as="div" alignItems="center" justifyItems="space-between" wrap="wrap">
              <Flex.Item size="50%" padding="0 small 0 0" shouldGrow>
                <Heading level="h4">
                  <div style={{overflowWrap: 'break-word'}}>
                    {groupTitle
                      ? I18n.t('All %{groupTitle} Outcomes', {
                          groupTitle: addZeroWidthSpace(groupTitle)
                        })
                      : I18n.t('All Group Outcomes')}
                  </div>
                </Heading>
              </Flex.Item>
              <Flex.Item>
                <Flex as="div" alignItems="center" wrap="wrap">
                  <Flex.Item as="div" padding="x-small medium x-small 0">
                    <Text size="medium">
                      {I18n.t(
                        {
                          one: '%{count} Outcome',
                          other: '%{count} Outcomes'
                        },
                        {
                          count: outcomesCount || 0
                        }
                      )}
                    </Text>
                  </Flex.Item>
                  <Flex.Item>
                    <Button
                      margin="x-small 0"
                      interaction={enabled ? 'enabled' : 'disabled'}
                      onClick={onAddAllHandler}
                    >
                      {I18n.t('Add All Outcomes')}
                    </Button>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
            </Flex>
          </View>
        </View>
        <div style={{flex: '1 0 24rem', overflow: 'auto', position: 'relative'}}>
          {outcomeList && (
            <View as="div" data-testid="find-outcome-items-list">
              {outcomeList}
            </View>
          )}
        </div>
      </div>
    </View>
  )
}

FindOutcomesView.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    outcomesCount: PropTypes.number.isRequired
  }).isRequired,
  searchString: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  onClearHandler: PropTypes.func.isRequired,
  onAddAllHandler: PropTypes.func.isRequired
}

export default FindOutcomesView
