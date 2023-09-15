import extractValue from './extract-value.js';

test('should throw error if provided path is not of a supported type', () => {
  const record = {};

  expect(() => extractValue(record)(123)).toThrow('Unsupported path \'123\' of type number');
});

test('should throw error if provided path is null', () => {
  const record = {};

  expect(() => extractValue(record)(null)).toThrow('Unsupported path \'null\' of type object');
});

test('should extract field from record `data`', () => {
  const record = {
    data: {
      level1: {
        level2: 'value'
      }
    }
  };

  const fieldValue = extractValue(record)('level1.level2');
  expect(fieldValue).toEqual('value');
});

test('should extract field from record `case_data`', () => {
  const record = {
    case_data: {
      level1: {
        level2: 'value'
      }
    }
  };

  const fieldValue = extractValue(record)('level1.level2');
  expect(fieldValue).toEqual('value');
});

test('should extract field as undefined when path does not exist', () => {
  const record = {
    data: {
      level1: {
        level2: 'value'
      }
    }
  };

  const fieldValue = extractValue(record)('nolevel.level2');
  expect(fieldValue).toBeUndefined();
});

test('should extract field as undefined when parent element is null', () => {
  const record = {
    data: {
      level1: null
    }
  };

  const fieldValue = extractValue(record)('level1.level2');
  expect(fieldValue).toBeUndefined();
});

test('should extract field as undefined when record has no data', () => {
  const record = {};

  const fieldValue = extractValue(record)('level1.level2');
  expect(fieldValue).toBeUndefined();
});

test('should extract array of fields from record data', () => {
  const record = {
    data: {
      level1: {level2: 'value1'},
      field2: 'value2',
    },
  };

  const values = extractValue(record)([
    'level1.level2',
    'notFound1',
    'field2',
    'notFound2',
  ]);
  expect(values).toEqual(['value1', undefined, 'value2', undefined]);
});

test('should extract object of fields from record data', () => {
  const record = {
    data: {
      level1: {level2: 'value1'},
      field2: 'value2',
    },
  };

  const values = extractValue(record)({
    value1: 'level1.level2',
    notFound1: 'notFound1',
    value2: 'field2',
    notFound2: 'notFound2',
  });
  expect(values).toEqual({
    value1: 'value1',
    notFound1: undefined,
    value2: 'value2',
    notFound2: undefined,
  });
});

describe('extracting collection items', () => {
  test('should extract simple collection item from record `data` using item index', () => {
    const record = {
      data: {
        level1: {
          level2: [
            {id: '123', value: 'value1'},
            {id: '456', value: 'value2'},
            {id: '789', value: 'value3'},
          ],
        }
      }
    };

    const fieldValues = extractValue(record)([
      'level1.level2[2].value',
      'level1.level2[1].value',
      'level1.level2[0].value',
    ]);
    expect(fieldValues).toEqual([
      'value3',
      'value2',
      'value1',
    ]);
  });

  test('should extract complex collection item from record `data` using item index', () => {
    const record = {
      data: {
        level1: {
          level2: [
            {id: '123', value: {key: 'value1'}},
            {id: '456', value: {key: 'value2'}},
          ],
        }
      }
    };

    const fieldValues = extractValue(record)('level1.level2[1].value.key');
    expect(fieldValues).toEqual('value2');
  });

  test('should extract collection item as undefined when out of range', () => {
    const record = {
      data: {
        level1: {
          level2: [
            {id: '123', value: 'value1'},
          ],
        }
      }
    };

    const fieldValues = extractValue(record)('level1.level2[1].value');
    expect(fieldValues).toBeUndefined();
  });

  test('should extract collection item as undefined when invalid index', () => {
    const record = {
      data: {
        level1: {
          level2: [
            {id: '123', value: 'value1'},
          ],
        }
      }
    };

    const fieldValues = extractValue(record)('level1.level2[a].value');
    expect(fieldValues).toBeUndefined();
  });

  test('should extract collection item as undefined when not collection', () => {
    const record = {
      data: {
        level1: {
          level2: 'hello',
        }
      }
    };

    const fieldValues = extractValue(record)('level1.level2[0].value');
    expect(fieldValues).toBeUndefined();
  });

  test('should extract collection item as undefined when item malformed', () => {
    const record = {
      data: {
        level1: {
          level2: [true],
        }
      }
    };

    const fieldValues = extractValue(record)('level1.level2[0].value');
    expect(fieldValues).toBeUndefined();
  });

  test('should extract collection item as undefined when null', () => {
    const record = {
      data: {
        level1: {
          level2: [null],
        }
      }
    };

    const fieldValues = extractValue(record)('level1.level2[0].value');
    expect(fieldValues).toBeUndefined();
  });

  test('should extract simple collection item from record `data` using item ID', () => {
    const record = {
      data: {
        level1: {
          level2: [
            {id: '123', value: 'value1'},
            {id: '456', value: 'value2'},
            {id: '789', value: 'value3'},
          ],
        }
      }
    };

    const fieldValues = extractValue(record)([
      'level1.level2[id:456].value',
      'level1.level2[id:789].value',
      'level1.level2[id:123].value',
    ]);
    expect(fieldValues).toEqual([
      'value2',
      'value3',
      'value1',
    ]);
  });

  test('should extract complex collection item from record `data` using item ID', () => {
    const record = {
      data: {
        level1: {
          level2: [
            {id: '123', value: {key: 'value1'}},
          ],
        }
      }
    };

    const fieldValues = extractValue(record)('level1.level2[id:123].value.key');
    expect(fieldValues).toEqual('value1');
  });

  test('should extract collection item as undefined when invalid ID', () => {
    const record = {
      data: {
        level1: {
          level2: [
            {id: '123', value: 'value1'},
          ],
        }
      }
    };

    const fieldValues = extractValue(record)('level1.level2[id:456].value');
    expect(fieldValues).toBeUndefined();
  });
});

describe('extracting metadata', () => {
  test('should throw error when metadata name does not exist', () => {
    const record = {};

    expect(() => extractValue(record)('[not_a_metadata]')).toThrow(`No metadata with name '[not_a_metadata]'`);
  });

  test('should support legacy record format (API v1 & v2)', () => {
    const record = {
      id: '1111222233334444',
      jurisdiction: 'Workspace-1',
      case_type_id: 'Type1',
      state: 'inProgress',
      security_classification: 'PUBLIC',
      created_date: '2023-02-22T11:22:33.000Z',
      last_modified: '2023-08-14T11:22:33.000Z',
      data: {},
    };

    const values = extractValue(record)([
      '[workspace]',
      '[type]',
      '[id]',
      '[state]',
      '[classification]',
      '[createdAt]',
      '[lastModifiedAt]',
    ]);
    expect(values).toEqual([
      'Workspace-1',
      'Type1',
      '1111222233334444',
      'inProgress',
      'PUBLIC',
      '2023-02-22T11:22:33.000Z',
      '2023-08-14T11:22:33.000Z',
    ]);
  });

  test('should extract workspace', () => {
    const record = {
      metadata: {
        workspace: 'Workspace-1'
      },
      data: {
        workspace: 'Wrong', // <-- Ignore, not metadata
      },
    };

    const values = extractValue(record)([
      '[workspace]',
      '[WORKSPACE]', // Case insensitive
      '[organisation]', // Legacy alias
      '[ORGANISATION]', // Legacy alias, case insensitive
      '[jurisdiction]', // Legacy alias
      '[JURISDICTION]', // Legacy alias, case insensitive
      'workspace', // Field, not metadata
    ]);
    expect(values).toEqual([
      'Workspace-1',
      'Workspace-1',
      'Workspace-1',
      'Workspace-1',
      'Workspace-1',
      'Workspace-1',
      'Wrong',
    ]);
  });

  test('should extract type', () => {
    const record = {
      metadata: {
        type: 'Type1',
      },
      data: {
        type: 'Wrong', // <-- Ignore, not metadata
      },
    };

    const values = extractValue(record)([
      '[type]',
      '[TYPE]', // Case insensitive
      '[case_type]', // Legacy alias
      '[CASE_TYPE]', // Legacy alias, case insensitive
      'type', // Field, not metadata
    ]);
    expect(values).toEqual([
      'Type1',
      'Type1',
      'Type1',
      'Type1',
      'Wrong',
    ]);
  });

  test('should extract reference', () => {
    const record = {
      id: '1111222233334444',
      data: {
        id: 'Wrong', // <-- Ignore, not metadata
      },
    };

    const values = extractValue(record)([
      '[id]',
      '[ID]', // Case-insensitive
      '[reference]', // Legacy alias
      '[REFERENCE]', // Legacy alias, case insensitive
      '[case_reference]', // Legacy alias
      '[CASE_REFERENCE]', // Legacy alias, case-insensitive
      'id', // Field, not metadata
    ]);
    expect(values).toEqual([
      '1111222233334444',
      '1111222233334444',
      '1111222233334444',
      '1111222233334444',
      '1111222233334444',
      '1111222233334444',
      'Wrong',
    ]);
  });

  test('should extract title', () => {
    const record = {
      id: '1111222233334444',
      metadata: {
        title: 'A distinctive title',
      },
      data: {
        title: 'Wrong', // <-- Ignore, not metadata
      },
    };

    const values = extractValue(record)([
      '[title]',
      '[TITLE]', // Case-insensitive
      'title', // Field, not metadata
    ]);
    expect(values).toEqual([
      'A distinctive title',
      'A distinctive title',
      'Wrong',
    ]);
  });

  test('should extract state', () => {
    const record = {
      metadata: {
        state: 'inProgress',
      },
      data: {
        state: 'Wrong', // <-- Ignore, not metadata
      },
    };

    const values = extractValue(record)([
      '[state]',
      '[STATE]', // Case insensitive
      'state', // Field, not metadata
    ]);
    expect(values).toEqual([
      'inProgress',
      'inProgress',
      'Wrong',
    ]);
  });

  test('should extract security classification', () => {
    const record = {
      metadata: {
        classification: 'PUBLIC',
      },
      data: {
        classification: 'Wrong', // <-- Ignore, not metadata
      },
    };

    const values = extractValue(record)([
      '[classification]',
      '[CLASSIFICATION]', // Case insensitive
      '[security_classification]', // Alias
      '[SECURITY_CLASSIFICATION]', // Alias, case-insensitive
      'classification', // Field, not metadata
    ]);
    expect(values).toEqual([
      'PUBLIC',
      'PUBLIC',
      'PUBLIC',
      'PUBLIC',
      'Wrong',
    ]);
  });

  test('should extract created date', () => {
    const record = {
      metadata: {
        createdAt: '2023-02-22T11:22:33.000Z',
      },
      data: {
        createdAt: 'Wrong', // <-- Ignore, not metadata
      },
    };

    const values = extractValue(record)([
      '[createdAt]',
      '[CREATEDAT]', // Case insensitive
      '[created_date]', // Legacy alias
      '[CREATED_DATE]', // Legacy alias, case-insensitive
      'createdAt', // Field, not metadata
    ]);
    expect(values).toEqual([
      '2023-02-22T11:22:33.000Z',
      '2023-02-22T11:22:33.000Z',
      '2023-02-22T11:22:33.000Z',
      '2023-02-22T11:22:33.000Z',
      'Wrong',
    ]);
  });

  test('should extract last modified date', () => {
    const record = {
      metadata: {
        lastModifiedAt: '2023-02-22T11:22:33.000Z',
      },
      data: {
        lastModifiedAt: 'Wrong', // <-- Ignore, not metadata
      },
    };

    const values = extractValue(record)([
      '[lastModifiedAt]',
      '[LASTMODIFIEDAT]', // Case insensitive
      '[last_modified]', // Alias
      '[LAST_MODIFIED]', // Alias, case-insensitive
      'lastModifiedAt', // Field, not metadata
    ]);
    expect(values).toEqual([
      '2023-02-22T11:22:33.000Z',
      '2023-02-22T11:22:33.000Z',
      '2023-02-22T11:22:33.000Z',
      '2023-02-22T11:22:33.000Z',
      'Wrong',
    ]);
  });
});
